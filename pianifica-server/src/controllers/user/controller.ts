import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";
import {
  deleteExistingUser,
  updateExistingUser,
} from "../../service/user-service";
import { updateUserSchema } from "./schema";
import { userInfoSchema } from "../../lib/schema";

export const getUsers = controllerWrapper(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: {
      updatedAt: "desc",
    },
  });

  res.success({
    message: "User fetched successfully!",
    data: users,
  });
});

export const updateUser = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, profilePictureUrl } = updateUserSchema.parse(
    req.body
  );

  if (req.user && req.user.id !== Number(id)) {
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

export const deleteUser = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "id is required to delete the user",
    });
    return;
  }

  if (req.user && req.user.id !== Number(id)) {
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
