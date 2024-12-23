import { useGetProjectTasksQuery } from "@/state/api";
import type React from "react";
import Header from "@/components/Header";
import type { Task } from "@/interface";
import { Status } from "@/enum";
import StatusTag from "../StatusTag";

import { DataTable } from "../DataTable";
import Loading from "../Loading";

type TableViewProps = {
	id: string;
	handleTaskModel: (action: string, task?: Task) => void;
};

const TableView = ({ id, handleTaskModel }: TableViewProps) => {
	const {
		data: tasks,
		error,
		isLoading,
	} = useGetProjectTasksQuery({ projectId: Number(id) });

	if (isLoading) return <Loading />;
	if (error || !tasks?.success)
		return <div>An error occurred while fetching tasks</div>;

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
		<div className="px-4 pb-8 xl:px-6">
			<div className="pt-5">
				<Header
					name="Table"
					buttonComponent={
						<button
							type="button"
							className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
							onClick={() => handleTaskModel("create")}
						>
							Add Task
						</button>
					}
					isSmallText
				/>
				{tasks?.data?.length === 0 ? (
					<div className="text-center mt-5">
						No Task Assigned to the project
					</div>
				) : (
					<DataTable data={tasks?.data} columns={taskColumns} />
				)}
			</div>
		</div>
	);
};

export default TableView;
