import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import type { Task } from "@/interface";
import { useGetProjectTasksQuery } from "@/state/api";
import { type DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import type React from "react";
import { useMemo, useState } from "react";
import Loading from "../Loading";
import ErrorComponent from "../Error";

type Props = {
	id: string;
	handleTaskModel: (action: string, task?: Task) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, handleTaskModel }: Props) => {
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
	const {
		data: tasks,
		error,
		isLoading,
	} = useGetProjectTasksQuery({ projectId: Number(id) });

	const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
		viewMode: ViewMode.Month,
		locale: "en-US",
	});

	const ganttTasks = useMemo(() => {
		return (
			tasks?.data?.map((task) => ({
				start: new Date(task.startDate as string),
				end: new Date(task.dueDate as string),
				name: task.title,
				id: `Task-${task.id}`,
				type: "task" as TaskTypeItems,
				progress: task.points ? (task.points / 10) * 100 : 0,
				isDisabled: false,
			})) || []
		);
	}, [tasks]);

	const handleViewModeChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setDisplayOptions((prev) => ({
			...prev,
			viewMode: event.target.value as ViewMode,
		}));
	};

	if (isLoading) return <Loading />;
	if (error || !tasks)
		return <ErrorComponent message={"An error occurred while fetching task"} />;

	return (
		<div className="px-4 xl:px-6">
			<div className="pt-5">
				<Header
					name="Project Tasks Timeline"
					buttonComponent={
						ganttTasks.length === 0 ? (
							<button
								type="button"
								className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
								onClick={() => handleTaskModel("create")}
							>
								Add Task
							</button>
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
						)
					}
					isSmallText
				/>
			</div>
			{ganttTasks.length === 0 ? (
				<div className="text-center mt-5">No Task Assigned to the project</div>
			) : (
				<>
					<div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary">
						<div className="timeline">
							<Gantt
								tasks={ganttTasks}
								{...displayOptions}
								columnWidth={
									displayOptions.viewMode === ViewMode.Month ? 150 : 100
								}
								listCellWidth="100px"
								barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
								barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
							/>
						</div>
						<div className="px-4 pb-5 pt-1">
							<button
								type="button"
								className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
								onClick={() => handleTaskModel("create")}
							>
								Add New Task
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Timeline;
