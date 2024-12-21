import { ACCESS_TOKEN_SECRET } from "../constants";
import { CustomError } from "../lib/error/custom.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
} from "../model/user-model";

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
  profilePictureUrl?: string;
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

export const getExistingUser = async ({
  id,
  username,
  email,
}: {
  id?: number;
  username?: string;
  email?: string;
}) => {
  let user = null;
  if (id) user = await getUserById({ id });
  else if (username) user = await getUserByUsername({ username });
  else if (email) user = await getUserByEmail({ email });

  return user;
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
    expiresIn: "1h",
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
