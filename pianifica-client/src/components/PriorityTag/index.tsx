import { Priority } from "@/enum";

const PriorityTag = ({ priority }: { priority: Priority }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs w-min font-semibold ${priority === Priority.URGENT
      ? "bg-red-200 text-red-700"
      : priority === Priority.HIGH
        ? "bg-yellow-200 text-yellow-700"
        : priority === Priority.MEDIUM
          ? "bg-green-200 text-green-700"
          : priority === Priority.LOW
            ? "bg-blue-200 text-blue-700"
            : priority === Priority.BACKLOG
              ? "bg-gray-200 text-gray-700"
              : "bg-gray-200 text-gray-700"
      }`}
  >
    {priority}
  </div>
);

export default PriorityTag;
