import type { Priority, Status } from "@prisma/client";
import prisma from "../utils/prisma";

export const createTask = async ({
  title,
  description = "",
  projectId,
  authorId,
  assigneeId,
  status = "TODO",
  priority = "BACKLOG",
  tags = null,
  startDate = null,
  dueDate = null,
  points = null,
}: {
  title: string;
  description: string | null;
  projectId: number;
  authorId: number;
  assigneeId?: number;
  status?: Status;
  priority?: Priority;
  tags?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number | null;
}) => {
  return prisma.task.create({
    data: {
      title,
      description,
      projectId,
      authorId,
      assigneeId,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
    },
  });
};

export const getTasks = async ({
  projectId,
  organizationId,
}: {
  projectId: number;
  organizationId: number;
}) => {
  return prisma.task.findMany({
    where: {
      projectId,
      deletedAt: null,
      project: {
        organizationId: organizationId,
        deletedAt: null,
      },
    },
    include: {
      author: true,
      assignee: true,
    },
  });
};

export const getUserTasks = async ({
  userId,
  filters,
}: {
  userId: number;
  filters?: {
    priority?: Priority | null;
    status?: Status | null;
  };
}) => {
  let filterParameters = {};
  if (filters?.priority)
    filterParameters = { ...filterParameters, priority: filters.priority };
  if (filters?.status)
    filterParameters = { ...filterParameters, status: filters.status };

  return prisma.task.findMany({
    where: {
      OR: [
        {
          assigneeId: userId,
        },
        {
          authorId: userId,
        },
      ],
      ...filterParameters,
      deletedAt: null,
    },
    include: {
      author: true,
      assignee: true,
    },
  });
};

export const getTaskById = async ({
  id,
  organizationId,
  withUserData = false,
}: {
  id: number;
  organizationId: number;
  withUserData?: boolean;
}) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      deletedAt: null,
      project: {
        organizationId: organizationId,
        deletedAt: null,
      },
    },
    include: {
      project: true,
      author: withUserData,
      assignee: withUserData,
    },
  });

  return task;
};

export const getTaskByTitle = async ({
  title,
  organizationId,
}: {
  title: string;
  organizationId: number;
}) => {
  const task = await prisma.task.findFirst({
    where: {
      title,
      deletedAt: null,
      project: {
        organizationId: organizationId,
        deletedAt: null,
      },
    },
    include: {
      project: true,
    },
  });

  return task;
};

export const updateTask = async ({
  id,
  title,
  description = "",
  assigneeId = null,
  status = "TODO",
  priority = "BACKLOG",
  tags = null,
  startDate = null,
  dueDate = null,
  points = null,
}: {
  id: number;
  title: string;
  description: string | null;
  assigneeId?: number | null;
  status?: Status;
  priority?: Priority;
  tags?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number | null;
}) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      assigneeId,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
    },
  });
};

export const updateTaskStatus = async ({
  id,
  status,
}: {
  id: number;
  status: Status;
}) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

export const updateTaskPriority = async ({
  id,
  priority,
}: {
  id: number;
  priority: Priority;
}) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      priority,
    },
  });
};

export const updateTaskAssignee = async ({
  id,
  assigneeId,
}: {
  id: number;
  assigneeId: number;
}) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      assigneeId,
    },
  });
};

export const deleteTask = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId: number;
}) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
