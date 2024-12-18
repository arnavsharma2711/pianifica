import { Status } from "@/enum";

const StatusTag = ({ status }: { status: Status }) => (
	<div
		className={`rounded-full px-2 py-1 text-xs w-min font-semibold ${
			status === Status.TODO
				? "bg-red-200 text-red-700"
				: status === Status.IN_PROGRESS
					? "bg-yellow-200 text-yellow-700"
					: status === Status.UNDER_REVIEW
						? "bg-blue-200 text-blue-700"
						: status === Status.RELEASE_READY
							? "bg-purple-200 text-purple-700"
							: status === Status.COMPLETED
								? "bg-green-200 text-green-700"
								: status === Status.BLOCKED
									? "bg-gray-300 text-gray-700"
									: "bg-gray-200 text-gray-700"
		}`}
	>
		{status}
	</div>
);

export default StatusTag;
