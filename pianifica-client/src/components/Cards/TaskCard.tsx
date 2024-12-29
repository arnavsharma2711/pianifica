"use client";

import type { Task } from "@/interface";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import StatusTag from "../StatusTag";
import { Priority } from "@/enum";
import PriorityTag from "../PriorityTag";
import UserCard from "./UserCard";

type Props = {
	task: Task;
};
const KeyValue = ({ keyName, value }: { keyName: React.ReactNode, value: React.ReactNode }) => {
	return (
		<div className="flex flex-col gap-1">
			<strong>{keyName}:</strong> {value}
		</div>
	)
}

const TaskCard = ({ task }: Props) => {
	const [isCollapsed, setIsCollapsed] = useState(true);

	return (
		<div className="mb-3 rounded-lg bg-white p-4 shadow-md dark:bg-dark-secondary">
			<div
				className={`mb-2 flex flex-row items-center justify-between ${isCollapsed ? "" : "pb-4 border-b-2 dark:border-zinc-800"} text-xl cursor-pointer`}
				onClick={() => setIsCollapsed(!isCollapsed)}
				onKeyUp={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setIsCollapsed(!isCollapsed);
					}
				}}
			>
				<div className="flex flex-row items-center justify-center gap-2">
					<p>
						<strong>{task.title}</strong>
					</p>
					{task.status && <StatusTag status={task.status} />}
				</div>

				{isCollapsed ? (
					<ChevronDown className="w-5 h-5" />
				) : (
					<ChevronUp className="w-5 h-5" />
				)}
			</div>

			{!isCollapsed && (
				<div className="space-y-4">
					<div className="flex items-start justify-between gap-10">
						<div className="w-full flex justify-between flex-col gap-4 p-2 rounded-lg whitespace-nowrap">
							<div className="w-full flex flex-row justify-between gap-1">
								<div>
									<div className="flex flex-col gap-1">
										<KeyValue keyName={"Description"} value={task.description} />
									</div>
									<div>
										{task.attachments && task.attachments.length > 0 && (
											<Image
												src={task.attachments[0].fileUrl || "/default-attachment.webp"}
												alt={task.attachments[0].fileName}
												width={400}
												height={200}
												className="h-auto w-full rounded-t-md"
											/>
										)}
									</div>
								</div>
								<div className="flex flex-col gap-2 mr-10">
									<KeyValue keyName={"Author"} value={task?.author ? <UserCard user={task.author} /> : "N/A"} />
									<KeyValue keyName={"Assignee"} value={task?.assignee ? <UserCard user={task.assignee} /> : "N/A"} />
								</div>

							</div>

							<KeyValue keyName={"Status"} value={<PriorityTag priority={task.priority || Priority.BACKLOG} />} />
							<KeyValue keyName={"Start Date"} value={task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"} />
							<KeyValue keyName={"Due Date"} value={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"} />
							<KeyValue keyName={"Points"} value={task.points} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskCard;
