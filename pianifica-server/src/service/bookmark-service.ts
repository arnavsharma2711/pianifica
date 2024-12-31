import { CustomError } from "../lib/error/custom.error";
import {
  getBookmark,
  getUserBookmarksByEntityType,
  createBookmark,
  deleteBookmark,
} from "../model/bookmark-model";
import { getExistingProject } from "./project-service";
import { getExistingTask } from "./task-service";
import { getExistingUser } from "./user-service";

const getEntity = async ({
  organizationId,
  entityType,
  entityId,
}: {
  organizationId: number;
  entityType: "Task" | "Project";
  entityId: number;
}) => {
  if (entityType === "Task") {
    return await getExistingTask({ id: entityId, organizationId });
  }
  if (entityType === "Project") {
    return await getExistingProject({ id: entityId, organizationId });
  }
};

export const createNewBookmark = async ({
  userId,
  organizationId,
  entityType,
  entityId,
}: {
  userId: number;
  organizationId: number;
  entityType: "Task" | "Project";
  entityId: number;
}) => {
  const existingBookmark = await getBookmark({
    userId,
    entityType,
    entityId,
  });

  if (existingBookmark) {
    throw new CustomError(
      400,
      "Bookmark already exists!",
      "Bookmark already exists for this entity."
    );
  }

  const existingEntity = await getEntity({
    organizationId,
    entityType,
    entityId,
  });
  if (!existingEntity) {
    throw new CustomError(
      404,
      `${entityType} not found!`,
      `${entityType} with the given ID not found.`
    );
  }

  const existingUser = await getExistingUser({ id: userId });
  if (!existingUser || existingUser.organizationId !== organizationId) {
    throw new CustomError(
      404,
      `User with id ${userId} does not exist in organization.`,
      "User not found"
    );
  }

  const bookmark = await createBookmark({
    userId,
    entityType,
    entityId,
  });

  return bookmark;
};

export const getUserExistingBookmarksByEntityType = async ({
  userId,
  entityType,
  limit = 5,
  page = 1,
}: {
  userId: number;
  entityType: "Task" | "Project";
  limit?: number;
  page?: number;
}) => {
  const bookmarks = await getUserBookmarksByEntityType({
    userId,
    entityType,
    limit,
    page,
  });

  return bookmarks;
};

export const deleteExistingBookmark = async ({
  userId,
  entityType,
  entityId,
}: {
  userId: number;
  entityType: "Task" | "Project";
  entityId: number;
}) => {
  const existingBookmark = await getBookmark({
    userId,
    entityType,
    entityId,
  });

  if (!existingBookmark) {
    throw new CustomError(
      400,
      "Bookmark does not exist!",
      "Bookmark does not exist for this entity."
    );
  }

  await deleteBookmark({ id: existingBookmark.id });
};
