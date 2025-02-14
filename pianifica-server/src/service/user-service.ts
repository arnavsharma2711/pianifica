import { ACCESS_TOKEN_SECRET, FE_URL } from "../constants";
import { CustomError } from "../lib/error/custom.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
  updateUserPassword,
} from "../model/user-model";
import type { Filter } from "../lib/filters";
import { generateMail } from "./mailer-service";

const determineHighestRole = ({
  userRoles,
}: {
  userRoles: { role: { name: string } }[];
}) => {
  const roleNames = userRoles?.map((userRole) => userRole.role?.name) || [];
  if (roleNames.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roleNames.includes("ORG_ADMIN")) return "ORG_ADMIN";
  return "MEMBER";
};

export const createNewUser = async ({
  organizationId,
  firstName,
  lastName,
  email,
  username,
  password,
  profilePictureUrl,
}: {
  organizationId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  profilePictureUrl?: string | null;
}) => {
  const existingUserWithEmail = await getExistingUser({
    email,
  });
  if (existingUserWithEmail)
    throw new CustomError(
      409,
      "Validation Error",
      "User with this email already exists!"
    );

  const existingUserWithUsername = await getExistingUser({
    username,
  });
  if (existingUserWithUsername)
    throw new CustomError(
      409,
      "Validation Error",
      "User with this username already exists!"
    );

  const createdUser = await createUser({
    organizationId,
    firstName,
    lastName,
    email,
    username,
    password,
    profilePictureUrl,
  });
  const { accessToken } = await generateUserToken(createdUser);

  return { accessToken, userDetails: createdUser };
};

export const updateExistingUser = async ({
  id,
  firstName,
  lastName,
  profilePictureUrl,
}: {
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}) => {
  const existingUser = await getExistingUser({ id });
  if (!existingUser) {
    throw new CustomError(404, "Not Found", "User not found!");
  }

  const updatedUser = await updateUser({
    id,
    firstName,
    lastName,
    profilePictureUrl,
  });

  return updatedUser;
};

export const updateExistingUserPassword = async ({
  email,
  oldPassword,
  newPassword,
}: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const { accessToken, userDetails } = await validateUserCredentials({
    emailOrUsername: email,
    password: oldPassword,
  });

  await updateUserPassword({ id: userDetails.id, password: newPassword });

  return { accessToken, userDetails };
};

export const getExistingUsers = async ({
  organizationId,
  filters,
}: {
  organizationId: number;
  filters: Filter;
}) => {
  const { users, totalCount } = await getUsers({
    organizationId,
    filters,
  });

  const usersWithRole = users.map((user) => ({
    ...user,
    role: determineHighestRole({ userRoles: user.userRoles }),
  }));

  return { users: usersWithRole, totalCount };
};

export const getExistingUser = async ({
  id,
  username,
  email,
  organizationId,
}: {
  id?: number;
  username?: string;
  email?: string;
  organizationId?: number;
}) => {
  let user = null;
  if (organizationId) {
    if (username) user = await getUserByUsername({ username, organizationId });
    if (id) user = await getUserById({ id, organizationId });
  } else {
    if (id) user = await getUserById({ id });
    else if (username) user = await getUserByUsername({ username });
    else if (email) user = await getUserByEmail({ email });
  }

  if (!user) return null;
  return {
    ...user,
    role: determineHighestRole({ userRoles: user.userRoles }),
  } as typeof user & { role: string };
};

export const generateUserToken = async ({
  id,
  email,
  username,
  organizationId,
}: {
  id: number;
  email: string;
  username: string;
  organizationId: number;
}) => {
  const accessTokenPayload = {
    id,
    email,
    username,
    organizationId,
  };
  const accessToken = jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: "8h",
  });

  return { accessToken };
};

export const validateUserCredentials = async ({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}) => {
  let user = null;
  if (emailOrUsername.includes("@")) {
    user = await getExistingUser({ email: emailOrUsername });
  } else {
    user = await getExistingUser({ username: emailOrUsername });
  }

  if (!user) {
    throw new CustomError(404, "User not found", "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError(401, "Invalid credentials", "Invalid credentials");
  }

  const { accessToken } = await generateUserToken({
    id: user.id,
    email: user.email,
    username: user.username,
    organizationId: user.organizationId,
  });

  return { accessToken, userDetails: user };
};

export const deleteExistingUser = async ({ id }: { id: number }) => {
  const user = await getExistingUser({ id });
  if (!user) {
    throw new CustomError(404, "Not Found", "User not found!");
  }

  await deleteUser({ id });
};

export const sendForgotPasswordMail = async ({
  emailOrUsername,
}: {
  emailOrUsername: string;
}) => {
  let user = null;
  if (emailOrUsername.includes("@")) {
    user = await getExistingUser({ email: emailOrUsername });
  } else {
    user = await getExistingUser({ username: emailOrUsername });
  }

  if (!user) {
    throw new CustomError(404, "Not Found", "User not found!");
  }

  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const reset_link = `${FE_URL}/reset-password?resetToken=${resetToken}`;

  await generateMail({
    mailerId: 2,
    receiverMail: user.email,
    variables: {
      "<user_name>": user.username,
      "<reset_link>": reset_link,
    } as Record<string, string>,
  });
};

const decodeResetToken = async (resetToken: string) => {
  try {
    const decoded = jwt.verify(resetToken, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw new CustomError(
      401,
      "Invalid token resetToken",
      "Invalid resetToken"
    );
  }
};

export const verifyForgotPasswordToken = async ({
  resetToken,
  newPassword,
}: {
  resetToken: string;
  newPassword: string;
}) => {
  const decoded = await decodeResetToken(resetToken);
  const { id, email } = decoded as { id: number; email: string };

  const user = await getExistingUser({ id });
  if (!user) {
    throw new CustomError(404, "Not Found", "User not found!");
  }

  await updateUserPassword({ id, password: newPassword });
};
