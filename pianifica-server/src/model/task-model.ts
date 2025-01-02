import type { Priority, Status, Task } from "@prisma/client";
import prisma from "../utils/prisma";
import type { Filter } from "../lib/filters";

export const createTask = async ({
  title,
  description = "",
  projectId,
  authorId,
  assigneeId,
  tags = [],
  status = "TODO",
  priority = "BACKLOG",
  startDate = null,
  dueDate = null,
  points = null,
}: {
  title: string;
  description: string | null;
  projectId: number;
  authorId: number;
  assigneeId?: number;
  tags?: number[];
  status?: Status;
  priority?: Priority;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number | null;
}) => {
  const tagsData = tags.map((tag) => ({
    tag: {
      connect: {
        id: tag,
      },
    },
  }));

  return prisma.task.create({
    data: {
      title,
      description,
      projectId,
      authorId,
      assigneeId,
      tags: {
        create: tagsData,
      },
      status,
      priority,
      startDate,
      dueDate,
      points,
    },
  });
};

export const getProjectTasks = async ({
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
      attachments: true,
      _count: {
        select: {
          comments: { where: { deletedAt: null } },
        },
      },
    },
  });
};

export const getTasks = async ({
  organizationId,
  filters,
}: {
  organizationId: number;
  filters: Filter;
}) => {
  const whereClause: {
    AND: {
      deletedAt: null;
      project: {
        organizationId: number;
        deletedAt: null;
      };
      title?: { contains: string; mode: "insensitive" };
      priority?: Priority;
      status?: Status;
    };
  } = {
    AND: {
      deletedAt: null,
      project: {
        organizationId,
        deletedAt: null,
      },
    },
  };

  if (filters.search) {
    whereClause.AND.title = { contains: filters.search, mode: "insensitive" };
  }

  if (filters.priority) {
    whereClause.AND.priority = filters.priority as Priority;
  }

  if (filters.status) {
    whereClause.AND.status = filters.status as Status;
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    include: {
      author: true,
      assignee: true,
    },
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
    orderBy: {
      [filters.sortBy]: filters.order,
    },
  });

  const totalCount = await prisma.task.count({
    where: whereClause,
  });

  return { tasks, totalCount };
};

export const getUserTasks = async ({
  userId,
  filters,
}: {
  userId: number;
  filters: Filter;
}) => {
  const whereClause: {
    AND: {
      deletedAt: null;
      OR: {
        assigneeId?: number;
        authorId?: number;
      }[];
      title?: { contains: string; mode: "insensitive" };
      priority?: Priority;
      status?: Status;
    };
  } = {
    AND: {
      deletedAt: null,
      OR: [{ assigneeId: userId }, { authorId: userId }],
    },
  };

  if (filters.search) {
    whereClause.AND.title = { contains: filters.search, mode: "insensitive" };
  }

  if (filters.priority) {
    whereClause.AND.priority = filters.priority as Priority;
  }

  if (filters.status) {
    whereClause.AND.status = filters.status as Status;
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    include: {
      author: true,
      assignee: true,
    },
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
    orderBy: {
      [filters.sortBy]: filters.order,
    },
  });

  const totalCount = await prisma.task.count({
    where: whereClause,
  });

  return { tasks, totalCount };
};

export const getTaskById = async ({
  id,
  organizationId,
  withUserData = false,
  withAttachments = false,
  withComments = false,
  withBookmarks = false,
  withTags = false,
}: {
  id: number;
  organizationId: number;
  withUserData?: boolean;
  withAttachments?: boolean;
  withComments?: boolean;
  withBookmarks?: boolean;
  withTags?: boolean;
}) => {
  let task = await prisma.task.findFirst({
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
      attachments: withAttachments,
      assignee: withUserData,
      tags: withTags && {
        include: {
          tag: true,
        },
      },
      comments: withComments
        ? {
            where: {
              deletedAt: null,
            },
            include: {
              user: true,
            },
          }
        : false,
    },
  });

  if (withBookmarks && task) {
    const bookmarkExists = await prisma.bookmark.findFirst({
      where: {
        entityType: "Task",
        entityId: id,
      },
    });

    task = { ...task, bookmarked: !!bookmarkExists } as Task & {
      bookmarked: boolean;
    };
  }

  if (withTags && task) {
    const taskTags = task.tags.map((item) => item?.tag?.name);

    task = { ...task, tags: taskTags } as Task & {
      tags: string[];
    };
  }

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
  tags = [],
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
  tags?: number[];
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number | null;
}) => {
  const tagsData = tags.map((tag) => ({
    tag: {
      connect: {
        id: tag,
      },
    },
  }));

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
      tags: {
        create: tagsData,
      },
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
