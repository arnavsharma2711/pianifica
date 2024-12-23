import controllerWrapper from "../../lib/controllerWrapper";
import {
  deleteExistingUser,
  getExistingUser,
  getExistingUsers,
  updateExistingUser,
} from "../../service/user-service";
import { updateUserSchema } from "./schema";
import { organizationSchema, userInfoSchema } from "../../lib/schema";
import { isAdmin } from "../../lib/utils";
import { getExistingOrganization } from "../../service/organization-service";

// GET api/users
export const getUsers = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view users",
    });
    return;
  }

  const { users, totalCount } = await getExistingUsers({
    organizationId: req.user?.organizationId,
  });

  const userInfo = users.map((user) => userInfoSchema.parse(user));

  res.success({
    message: "User fetched successfully!",
    data: userInfo,
    total_count: totalCount,
  });
});

// GET api/user/:username
export const getUser = controllerWrapper(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    res.invalid({
      message: "Missing required parameter: username",
      error: "username is required to fetch the user",
    });
    return;
  }

  const user = await getExistingUser({
    username,
    organizationId: req.user?.organizationId,
  });

  if (!user) {
    res.invalid({
      message: "User not found!",
      error: "User with the given username does not exist",
    });
    return;
  }

  const userInfo = userInfoSchema.parse(user);
  res.success({
    message: "User fetched successfully!",
    data: userInfo,
  });
});

// GET api/user
export const getCurrentUser = controllerWrapper(async (req, res) => {
  const userInfo = userInfoSchema.parse(req.user);
  res.success({
    message: "User fetched successfully!",
    data: userInfo,
  });
});

// GET api/user/organization
export const getUserOrganization = controllerWrapper(async (req, res) => {
  const organization = await getExistingOrganization({
    id: Number(req.user?.organizationId),
  });

  if (!organization) {
    res.invalid({
      message: "Organization not found.",
      error: "Organization with provided id not found.",
    });
    return;
  }

  const organizationData = organizationSchema.parse(organization);
  res.success({
    message: "Organization fetched successfully.",
    data: organizationData,
  });
});

// POST api/user/:id
export const updateUser = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, profilePictureUrl } = updateUserSchema.parse(
    req.body
  );

  if (req.user && req.user.id !== Number(id) && !isAdmin(req.user.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update this user",
    });
    return;
  }

  const updatedUser = await updateExistingUser({
    id: Number(id),
    firstName,
    lastName,
    profilePictureUrl,
  });

  const userInfo = userInfoSchema.parse(updatedUser);
  res.success({
    message: "User updated successfully!",
    data: userInfo,
  });
});

// DELETE api/user/:id
export const deleteUser = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "id is required to delete the user",
    });
    return;
  }

  if (req.user && req.user.id !== Number(id) && !isAdmin(req.user.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to delete this user",
    });
    return;
  }

  await deleteExistingUser({ id: Number(id) });

  res.success({
    message: "User deleted successfully!",
  });
});
