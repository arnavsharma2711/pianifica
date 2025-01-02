import controllerWrapper from "../../lib/controllerWrapper";
import {
  deleteExistingUser,
  getExistingUser,
  getExistingUsers,
  updateExistingUser,
  updateExistingUserPassword,
} from "../../service/user-service";
import { updateUserSchema } from "./schema";
import {
  filterSchema,
  organizationSchema,
  taskSchema,
  userInfoSchema,
} from "../../lib/schema";
import { isAdmin } from "../../lib/utils";
import { getExistingOrganization } from "../../service/organization-service";
import { getFilters } from "../../lib/filters";
import { userTaskSchema } from "../task/schema";
import { getExistingUserTasks } from "../../service/task-service";
import { COOKIE_SETTINGS } from "../../constants";

// GET api/users
export const getUsers = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view users",
    });
    return;
  }

  const filters = filterSchema.parse(req.query);

  const { users, totalCount } = await getExistingUsers({
    organizationId: req.user?.organizationId,
    filters: getFilters(filters, "users"),
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

// GET api/user/tasks
export const getUserTasks = controllerWrapper(async (req, res) => {
  if (req.user?.id === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch task.",
    });
    return;
  }
  const filters = userTaskSchema.parse(req.query);

  const { tasks, totalCount } = await getExistingUserTasks({
    userId: req.user?.id,
    filters: getFilters(filters, "tasks"),
  });

  let taskData: object[] = [];
  if (tasks.length > 0) taskData = tasks.map((task) => taskSchema.parse(task));
  res.success({
    message: "Tasks fetched successfully.",
    data: taskData,
    total_count: totalCount,
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

// PATCH api/user/update-password
export const updateUserPassword = controllerWrapper(async (req, res) => {
  if (req.user?.email === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update this user",
    });
    return;
  }
  const { oldPassword, newPassword } = req.body;

  const { accessToken, userDetails } = await updateExistingUserPassword({
    email: req.user?.email,
    oldPassword,
    newPassword,
  });

  const userInfo = userInfoSchema.parse(userDetails);
  res.cookie("accessToken", accessToken, COOKIE_SETTINGS).success({
    message: "Password updated successfully!",
    data: {
      accessToken,
      userInfo,
    },
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
