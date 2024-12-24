"use client";

import { useGetProjectsQuery, useGetUserTasksQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useAppSelector } from "./redux";
import { Status, type Priority } from "@/enum";
import type { Project, Task } from "@/interface";
import { DataTable } from "@/components/DataTable";
import StatusTag from "@/components/StatusTag";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const {
		data: tasks,
		isLoading: tasksLoading,
		isError: tasksError,
	} = useGetUserTasksQuery({ limit: limit, page: page });
	const { data: projects, isLoading: isProjectsLoading } =
		useGetProjectsQuery();

	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

	if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
	if (tasksError || !tasks?.success || !projects?.success)
		return <div>Error fetching data</div>;

	const priorityCount = tasks?.data.reduce(
		(acc: Record<string, number>, task: Task) => {
			const { priority } = task;
			acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
			return acc;
		},
		{},
	);

	const taskDistribution = Object.keys(priorityCount).map((key) => ({
		name: key,
		count: priorityCount[key],
	}));

	const statusCount = projects?.data.reduce(
		(acc: Record<string, number>, project: Project) => {
			const status =
				project.endDate && new Date(project.endDate) < new Date()
					? "Completed"
					: "Active";
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		},
		{},
	);

	const projectStatus = Object.keys(statusCount).map((key) => ({
		name: key,
		count: statusCount[key],
	}));

	const chartColors = isDarkMode
		? {
			bar: "#8884d8",
			barGrid: "#303030",
			pieFill: "#4A90E2",
			text: "#FFFFFF",
		}
		: {
			bar: "#8884d8",
			barGrid: "#E0E0E0",
			pieFill: "#82ca9d",
			text: "#000000",
		};

	const pagination = {
		page,
		limit,
		total: tasks.total_count || 10,
		setPage,
		setLimit,
	}

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
			header: "Due Date",
			accessorKey: "dueDate" as keyof Task,
			cell: (task: Task) =>
				task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
		},
	];
	return (
		<div className="h-full w-full bg-gray-100 bg-transparent p-8">
			<Header name="Project Management Dashboard" />
			<div className="flex flex-col select-none gap-6 ">
				<div className="w-full gap-6 flex items-center justify-center flex-row">
					<div className="w-full rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
						<h3 className="mb-4 text-lg font-semibold dark:text-white">
							Task Priority Distribution
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={taskDistribution}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={chartColors.barGrid}
								/>
								<XAxis dataKey="name" stroke={chartColors.text} />
								<YAxis stroke={chartColors.text} />
								<Tooltip
									contentStyle={{
										width: "min-content",
										height: "min-content",
									}}
								/>
								<Legend />
								<Bar dataKey="count" fill={chartColors.bar} />
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="w-full  rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
						<h3 className="mb-4 text-lg font-semibold dark:text-white">
							Project Status
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
									{projectStatus.map((entry) => (
										<Cell
											key={entry.name}
											fill={COLORS[projectStatus.indexOf(entry) % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
					<h3 className="mb-4 text-lg font-semibold dark:text-white">
						Your Tasks
					</h3>
					<DataTable data={tasks.data} columns={taskColumns} showPagination={true} pagination={pagination} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
