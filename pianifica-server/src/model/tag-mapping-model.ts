import prisma from "../utils/prisma";

export const createTagMapping = async ({
  tagId,
  taskId,
}: {
  tagId: number;
  taskId: number;
}) => {
  return await prisma.tagMapping.create({
    data: {
      tagId,
      taskId,
    },
  });
};

export const createTagMappings = async ({
  tagIds,
  taskId,
}: {
  tagIds: number[];
  taskId: number;
}) => {
  return await prisma.tagMapping.createMany({
    data: tagIds.map((tagId) => ({
      tagId,
      taskId,
    })),
  });
};

export const getTagsByTaskId = async ({ taskId }: { taskId: number }) => {
  return await prisma.tagMapping.findMany({
    where: {
      taskId,
    },
    include: {
      tag: true,
    },
  });
};

export const getTasksByTagId = async ({
  tagId,
  organizationId,
}: {
  tagId: number;
  organizationId: number;
}) => {
  return await prisma.tagMapping.findMany({
    where: {
      tagId,
      task: {
        project: {
          organizationId,
        },
      },
    },
    include: {
      task: true,
    },
  });
};

export const getTagMappings = async ({ id }: { id: number }) => {
  return await prisma.tagMapping.findMany({ where: { tagId: id } });
};

export const deleteTagMapping = async ({
  tagId,
  taskId,
}: {
  tagId: number;
  taskId: number;
}) => {
  return await prisma.tagMapping.delete({
    where: {
      tagId_taskId: {
        tagId,
        taskId,
      },
    },
  });
};

export const deleteTagMappings = async ({
  tagIds,
  taskId,
}: {
  taskId: number;
  tagIds: number[];
}) => {
  return await prisma.tagMapping.deleteMany({
    where: {
      taskId,
      tagId: {
        in: tagIds,
      },
    },
  });
};

export const deleteAllTaskMappings = async ({ taskId }: { taskId: number }) => {
  return await prisma.tagMapping.deleteMany({
    where: {
      taskId,
    },
  });
};
