import Link from "next/link";
import type { Notification } from "@/interface";
import { BookUser, CircleHelp, ClipboardCheck, ExternalLink } from "lucide-react";
import { useMarkAsSeenMutation } from "@/state/api";

const messageMap: Record<string, Record<string, string>> = {
  Task: {
    Assigned: "You have been assigned a task",
    Updated: "A task you are assigned to has been updated",
    Deleted: "A task you are assigned to has been deleted",
    Comment: "A task you are assigned to has a new comment",
  },
  Team: {
    Assigned: "You have been assigned to a team",
    ProjectAssigned: "Your Team has been assigned to a project",
  },
};

const NotificationLink = ({ notification }: { notification: Notification }) => {
  const { entityType, entityId } = notification.content;
  const message =
    messageMap[notification.type]?.[notification.subType] || "You have a new notification";

  let href = "#";
  if (entityType === "Task") {
    href = `/task/${entityId}`;
  } else if (entityType === "Project") {
    href = `/project/${entityId}`;
  } else if (entityType === "Team") {
    href = `/team/${entityId}`;
  }
  const icon = notification.type === "Task" ? <ClipboardCheck /> : notification.type === "Team" ? <BookUser /> : <CircleHelp />;

  const [markAsSeen] = useMarkAsSeenMutation();

  const handleClick = (id: number) => {
    markAsSeen({
      id,
    });
  }
  return (
    <div className={`${notification.seenAt === null ? 'bg-gray-200 dark:bg-zinc-700' : ""} border dark:border-zinc-700 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-900`}>
      <div className="flex items-center justify-between gap-10">
        <Link href={href} className="flex items-center gap-2 hover:cursor-pointer">
          {icon}
          {message}
        </Link>{
          notification.seenAt === null && <button type="button" className="text-blue-500 text-xs w-20 hover:cursor-pointer hover:underline" onClick={() => handleClick(notification.id)}>Mark as seen</button>
        }

      </div>
    </div>
  );
};

const NotificationContainer = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <div className="absolute top-full mt-2 right-0 w-[350px] bg-white dark:bg-zinc-800 shadow-md rounded-lg">
      <div className="flex items-center justify-between p-2 border-b-2 dark:border-zinc-700">
        <span className="font-semibold">Notifications</span>
        <Link href='/notifications' className="flex items-center gap-2 text-zinc-400">Show all <ExternalLink size={15} /></Link>
      </div>
      <NotificationBox notifications={notifications} />
    </div>
  );
};

const NotificationBox = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <>
      <div className="flex flex-col p-2 gap-2">
        {notifications?.length ? (
          notifications.map((notification) => (
            <NotificationLink key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="text-center text-sm text-gray-500">
            No new notifications
          </div>
        )}
      </div>
    </>

  );
}

export { NotificationBox };
export default NotificationContainer;
