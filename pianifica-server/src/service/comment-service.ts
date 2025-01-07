import { CustomError } from "../lib/error/custom.error";
import { getExistingUser } from "./user-service";

import {
  createComment,
  getCommentsByTaskId,
  getCommentById,
  updateComment,
  deleteComment,
} from "../model/comment-model";
import { getExistingTask } from "./task-service";
import { createNewNotification } from "./notification-service";

export const createNewComment = async ({
  taskId,
  organizationId,
  text,
  createdBy,
}: {
  taskId: number;
  organizationId: number;
  text: string;
  createdBy: number;
}) => {
  const existingTask = await getExistingTask({ id: taskId, organizationId });

  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${taskId} does not exist in organization.`,
      "Task not found"
    );
  }

  const existingUser = await getExistingUser({ id: createdBy });
  if (!existingUser || existingUser.organizationId !== organizationId) {
    throw new CustomError(
      404,
      `User with id ${createdBy} does not exist in organization.`,
      "User not found"
    );
  }

  const comment = await createComment({
    taskId: taskId,
    text,
    userId: createdBy,
  });

  await createNewNotification({
    type: "Task",
    subType: "Comment",
    userId: existingTask.authorId,
    content: {
      entityId: taskId,
      entityType: "Task",
    },
  });

  if (existingTask.assigneeId)
    await createNewNotification({
      type: "Task",
      subType: "Comment",
      userId: existingTask.assigneeId,
      content: {
        entityId: taskId,
        entityType: "Task",
      },
    });

  return comment;
};

export const getCommentsByTask = async ({
  taskId,
  organizationId,
}: {
  taskId: number;
  organizationId: number;
}) => {
  const existingTask = await getExistingTask({ id: taskId, organizationId });

  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${taskId} does not exist in organization.`,
      "Task not found"
    );
  }

  const comments = await getCommentsByTaskId({ taskId });
  return comments;
};

export const getComment = async ({ id }: { id: number }) => {
  return await getCommentById({ id });
};

export const updateExistingComment = async ({
  id,
  text,
  updatedBy,
}: {
  id: number;
  text: string;
  updatedBy: number;
}) => {
  const existingComment = await getComment({ id });

  if (!existingComment) {
    throw new CustomError(
      400,
      "Comment not found!",
      "Comment not found with the given id."
    );
  }

  if (existingComment.userId !== updatedBy) {
    throw new CustomError(
      403,
      "Unauthorized!",
      "You are not authorized to update this comment."
    );
  }

  const comment = await updateComment({ id, text });
  return comment;
};

export const deleteExistingComment = async ({
  id,
  deletedBy,
  isAdmin,
}: {
  id: number;
  deletedBy: number;
  isAdmin: boolean;
}) => {
  const existingComment = await getComment({ id });

  if (!existingComment) {
    throw new CustomError(
      400,
      "Comment not found!",
      "Comment not found with the given id."
    );
  }
  if (existingComment.userId !== deletedBy && !isAdmin) {
    throw new CustomError(
      403,
      "Unauthorized!",
      "You are not authorized to delete this comment."
    );
  }

  const comment = await deleteComment({ id });
  return comment;
};
