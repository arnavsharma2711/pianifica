import controllerWrapper from "../../lib/controllerWrapper";
import {
  markAllNotificationAsSeen,
  markNotificationAsSeen,
} from "../../service/notification-service";

// PATCH api/notification
export const markAllAsSeenNotification = controllerWrapper(async (req, res) => {
  if (req.user?.id === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch task.",
    });
    return;
  }

  await markAllNotificationAsSeen({
    userId: req.user?.id,
  });

  res.success({
    message: "All notifications marked as seen",
  });
});

// PATCH api/notification/:id
export const markAsSeenNotification = controllerWrapper(async (req, res) => {
  if (req.user?.id === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch task.",
    });
    return;
  }
  const { id } = req.params;

  await markNotificationAsSeen({
    id: Number(id),
    userId: req.user?.id,
  });

  res.success({
    message: "Notification marked as seen",
  });
});
