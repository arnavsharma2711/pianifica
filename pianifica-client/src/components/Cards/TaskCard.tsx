"use client";

import type { Task } from "@/interface";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import StatusTag from "../StatusTag";

type Props = {
	task: Task;
};

const TaskCard = ({ task }: Props) => {
	const [isCollapsed, setIsCollapsed] = useState(true);

	return (
		<div className="mb-3 rounded-lg bg-white p-4 shadow-md dark:bg-dark-secondary">
			<div
				className={`mb-2 flex flex-row items-center justify-between ${isCollapsed ? "" : "pb-4 border-b-2"} text-xl cursor-pointer`}
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
				<div className="pl-[1px]">
					<p className="mb-2">
						<strong>Description:</strong>{" "}
						{task.description || "No description provided"}
					</p>

					<p className="mb-2">
						<strong>Priority:</strong> {task.priority}
					</p>
					<p className="mb-2">
						<strong>Tags:</strong> {task.tags || "No tags"}
					</p>
					<p className="mb-2">
						<strong>Start Date:</strong>{" "}
						{task.startDate
							? new Date(task.startDate).toLocaleDateString()
							: "Not set"}
					</p>
					<p className="mb-2">
						<strong>Due Date:</strong>{" "}
						{task.dueDate
							? new Date(task.dueDate).toLocaleDateString()
							: "Not set"}
					</p>
					<p className="mb-2">
						<strong>Author:</strong>{" "}
						{task.author
							? `${task.author.firstName} ${task.author.lastName}`
							: "System Added"}
					</p>
					<p className="mb-2">
						<strong>Assignee:</strong>{" "}
						{task.assignee
							? `${task.assignee.firstName} ${task.assignee.lastName}`
							: "Unassigned"}
					</p>
					{task.attachments && task.attachments.length > 0 && (
						<div className="mb-4">
							<strong className="block mb-2">Attachments:</strong>
							<div className="flex flex-wrap gap-2">
								{task.attachments.map((attachment) => (
									<Image
										key={attachment.fileName}
										src={attachment.fileUrl || "/default-attachment.webp"}
										alt={attachment.fileName}
										width={400}
										height={200}
										className="rounded-md"
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TaskCard;
