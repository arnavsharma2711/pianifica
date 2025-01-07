import { CustomError } from "../lib/error/custom.error";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotificationByUserId,
  updateAllNotificationSeenAt,
  updateNotification,
  updateNotificationSeenAt,
} from "../model/notification-model";

export const createNewNotification = async ({
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
  return await createNotification({
    type,
    subType,
    userId,
    content,
  });
};

export const getExistingNotification = async ({ id }: { id: number }) => {
  const notification = await getNotificationById({ id });

  if (!notification) {
    throw new CustomError(
      400,
      "Notification not found!",
      "Notification with given id not found."
    );
  }

  return notification;
};

export const getExistingNotifications = async ({
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
  const { notifications, totalCount } = await getNotificationByUserId({
    userId,
    filters,
  });

  return { notifications, totalCount };
};

export const updateExistingNotification = async ({
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
  const existingNotification = await getExistingNotification({ id });
  if (!existingNotification) {
    throw new CustomError(
      400,
      "Notification not found!",
      "Notification with the given ID does not exist."
    );
  }

  return await updateNotification({
    id,
    type,
    subType,
    userId,
    content,
  });
};

export const markAllNotificationAsSeen = async ({
  userId,
}: {
  userId: number;
}) => {
  await updateAllNotificationSeenAt({ userId });
};

export const markNotificationAsSeen = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  const existingNotification = await getExistingNotification({ id });
  if (!existingNotification) {
    throw new CustomError(
      400,
      "Notification not found!",
      "Notification with the given ID does not exist."
    );
  }

  if (existingNotification.userId !== userId) {
    throw new CustomError(
      400,
      "Unauthorized!",
      "You are not authorized to mark this notification as seen."
    );
  }

  return await updateNotificationSeenAt({ id });
};

export const deleteExistingNotification = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  const existingNotification = await getExistingNotification({ id });
  if (!existingNotification) {
    throw new CustomError(
      400,
      "Notification not found!",
      "Notification with the given ID does not exist."
    );
  }

  if (existingNotification.userId !== userId) {
    throw new CustomError(
      400,
      "Unauthorized!",
      "You are not authorized to delete this notification."
    );
  }

  return await deleteNotification({
    id,
  });
};
