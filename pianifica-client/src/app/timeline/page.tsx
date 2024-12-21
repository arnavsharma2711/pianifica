"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { type DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import type React from "react";
import { useMemo, useState } from "react";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
	const { data: projects, error, isLoading } = useGetProjectsQuery();

	const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
		viewMode: ViewMode.Month,
		locale: "en-US",
	});

	const ganttTasks = useMemo(() => {
		return (
			projects?.data?.map((project) => ({
				start: new Date(project.startDate as string),
				end: new Date(project.endDate as string),
				name: project.name,
				id: `Task-${project.id}`,
				type: "task" as TaskTypeItems,
				progress: 50,
				isDisabled: false,
			})) || []
		);
	}, [projects]);

	const handleViewModeChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setDisplayOptions((prev) => ({
			...prev,
			viewMode: event.target.value as ViewMode,
		}));
	};

	if (isLoading) return <div>Loading...</div>;
	if (error || !projects)
		return <div>An error occurred while fetching projects</div>;

	return (
		<div className="max-w-full p-8">
			<header className="mb-4 flex items-center justify-between">
				<Header name="Projects Timeline" />
				{ganttTasks.length === 0 ? (
					<div className="text-center mt-5">No Projects to display</div>
				) : (
					<div className="relative inline-block w-64">
						<select
							className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary"
							value={displayOptions.viewMode}
							onChange={handleViewModeChange}
						>
							<option value={ViewMode.Day}>Day</option>
							<option value={ViewMode.Week}>Week</option>
							<option value={ViewMode.Month}>Month</option>
						</select>
					</div>
				)}
			</header>
			{ganttTasks.length !== 0 && (
				<div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary">
					<div className="timeline">
						<Gantt
							tasks={ganttTasks}
							{...displayOptions}
							columnWidth={
								displayOptions.viewMode === ViewMode.Month ? 150 : 100
							}
							listCellWidth="100px"
							projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
							projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
							projectBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Timeline;
