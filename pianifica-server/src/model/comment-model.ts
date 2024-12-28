import exp from "node:constants";
import prisma from "../utils/prisma";

export const createComment = async ({
  taskId,
  userId,
  text,
}: {
  taskId: number;
  userId: number;
  text: string;
}) => {
  return await prisma.comment.create({
    data: {
      taskId,
      userId,
      text,
    },
  });
};

export const getCommentsByTaskId = async ({ taskId }: { taskId: number }) => {
  return await prisma.comment.findMany({
    where: {
      taskId,
    },
  });
};

export const getCommentById = async ({ id }: { id: number }) => {
  return await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });
};

export const updateComment = async ({
  id,
  text,
}: {
  id: number;
  text: string;
}) => {
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      text,
    },
  });
};

export const deleteComment = async ({ id }: { id: number }) => {
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
