import prisma from "../utils/prisma";

export const createNotification = async ({
  type,
  subType,
  userId,
  content,
}: {
  type: string;
  subType: string;
  userId: number;
  content: {
    entityType: string;
    entityId: number;
    message?: string;
  };
}) => {
  return await prisma.notification.create({
    data: {
      type,
      subType,
      userId,
      content,
    },
  });
};

export const getNotificationById = async ({ id }: { id: number }) => {
  return await prisma.notification.findFirst({
    where: { id },
  });
};

export const getNotificationByUserId = async ({
  userId,
  filters = {
    limit: 10,
    page: 0,
    unSeenOnly: false,
  },
}: {
  userId: number;
  filters: {
    limit: number;
    page: number;
    unSeenOnly?: boolean;
  };
}) => {
  const whereClause: {
    userId: number;
    seenAt?: null;
  } = {
    userId,
  };

  if (filters.unSeenOnly) {
    whereClause.seenAt = null;
  }
  const notifications = await prisma.notification.findMany({
    where: whereClause,
    orderBy: {
      id: "desc",
    },
    take: filters.limit,
    skip: (filters.page - 1) * filters.limit,
  });

  const totalCount = await prisma.notification.count({
    where: { userId },
  });

  return { notifications, totalCount };
};

export const updateNotification = async ({
  id,
  type,
  subType,
  userId,
  content,
}: {
  id: number;
  type: string;
  subType: string;
  userId: number;
  content: {
    entityType: string;
    entityId: number;
    message?: string;
  };
}) => {
  return await prisma.notification.update({
    where: { id },
    data: { type, subType, userId, content },
  });
};

export const updateAllNotificationSeenAt = async ({
  userId,
}: {
  userId: number;
}) => {
  return await prisma.notification.updateMany({
    where: { userId, seenAt: null },
    data: { seenAt: new Date() },
  });
};

export const updateNotificationSeenAt = async ({ id }: { id: number }) => {
  return await prisma.notification.update({
    where: { id },
    data: { seenAt: new Date() },
  });
};

export const deleteNotification = async ({ id }: { id: number }) => {
  return await prisma.notification.delete({
    where: { id },
  });
};
