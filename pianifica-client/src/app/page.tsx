"use client";

import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import React from "react";
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
import type { Priority } from "@/enum";
import type { Project, Task } from "@/interface";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
	const {
		data: tasks,
		isLoading: tasksLoading,
		isError: tasksError,
	} = useGetTasksQuery({ projectId: Number.parseInt("1") });
	const { data: projects, isLoading: isProjectsLoading } =
		useGetProjectsQuery();

	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

	if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
	if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

	const priorityCount = tasks.reduce(
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

	const statusCount = projects.reduce(
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

	return (
		<div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
			<Header name="Project Management Dashboard" />
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
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
				<div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
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
				<div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
					<h3 className="mb-4 text-lg font-semibold dark:text-white">
						Your Tasks
					</h3>
					<div className="overflow-x-auto relative border-2 shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left rtl:text-right">
							<thead className="text-xs uppercase border-b bg-gray-100 dark:bg-dark-secondary">
								<tr>
									<th className="px-6 py-3 border-r">Title</th>
									<th className="px-6 py-3 border-r">Status</th>
									<th className="px-6 py-3 border-r">Priority</th>
									<th className="px-6 py-3 border-r">Due Date</th>
								</tr>
							</thead>
							<tbody>
								{tasks.map((task, index) => (
									<tr
										key={task.id}
										className={`${index % 2 === 0 ? "bg-gray-200 dark:bg-zinc-800" : "bg-gray-100 dark:bg-zinc-900"} hover:bg-gray-300 dark:hover:bg-zinc-700`}
									>
										<td className="px-6 py-4">{task.title}</td>
										<td className="px-6 py-4">{task.status}</td>
										<td className="px-6 py-4">{task.priority}</td>
										<td className="px-6 py-4">
											{task.dueDate
												? new Date(task.dueDate).toLocaleDateString()
												: "N/A"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
