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
