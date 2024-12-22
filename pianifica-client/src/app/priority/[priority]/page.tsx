"use client";

import { useGetUserTasksQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { DataTable } from "@/components/DataTable";
import type { Task } from "@/interface";
import { Status, type Priority as PriorityEnum } from "@/enum";
import StatusTag from "@/components/StatusTag";

type Props = {
	params: Promise<{ priority: string }>;
};

const Priority = ({ params }: Props) => {
	const [priority, setPriority] = useState<string | null>(null);

	useEffect(() => {
		params.then((resolvedParams) => {
			setPriority(resolvedParams.priority);
		});
	}, [params]);

	const {
		data: tasks,
		isLoading,
		isError,
	} = useGetUserTasksQuery({
		priority: priority as PriorityEnum,
	});

	if (!priority || isLoading) return <div>Loading...</div>;
	if (isError || !tasks?.success) return <div>Error fetching tasks</div>;

	const taskColumns = [
		{
			header: "Title",
			accessorKey: "title" as keyof Task,
		},
		{
			header: "Status",
			accessorKey: "status" as keyof Task,
			cell: (task: Task) => <StatusTag status={task.status || Status.TODO} />,
		},
		{
			header: "Priority",
			accessorKey: "priority" as keyof Task,
			cell: (task: Task) => task.priority || "N/A",
		},
		{
			header: "Start Date",
			accessorKey: "startDate" as keyof Task,
			cell: (task: Task) =>
				task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A",
		},
		{
			header: "Due Date",
			accessorKey: "dueDate" as keyof Task,
			cell: (task: Task) =>
				task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
		},
		{
			header: "Points",
			accessorKey: "points" as keyof Task,
			cell: (task: Task) => task.points?.toString() || "0",
		},
		{
			header: "Tags",
			accessorKey: "tags" as keyof Task,
			cell: (task: Task) => task.tags || "None",
		},
	];

	return (
		<div className="flex w-full flex-col p-8">
			<Header name="Tasks" />
			<DataTable
				data={tasks?.data}
				columns={taskColumns}
				emptyStr={`No task available with Priority: ${priority.toUpperCase()}`}
			/>
		</div>
	);
};

export default Priority;
