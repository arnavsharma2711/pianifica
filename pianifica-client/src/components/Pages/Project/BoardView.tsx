import Header from "@/components/Header";
import type { Task as TaskType } from "@/interface";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
	DndProvider,
	type DragSourceMonitor,
	type DropTargetMonitor,
	useDrag,
	useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type TaskColumnProps = {
	status: string;
	tasks: TaskType[];
	moveTask: (taskId: number, status: string) => void;
	setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
	status,
	tasks,
	moveTask,
	setIsModalNewTaskOpen,
}: TaskColumnProps) => {
	const [{ isOver }, dropRef] = useDrop(() => ({
		accept: "task",
		drop: (item: { id: number }) => moveTask(item.id, status),
		collect: (monitor: DropTargetMonitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	const taskCount = tasks.filter((task) => task.status === status).length;

	const TASK_STATUS_COLOR: { [key in (typeof TASK_STATUS)[number]]: string } = {
		"To Do": "bg-red-500",
		"Work In Progress": "bg-yellow-500",
		"Under Review": "bg-blue-500",
		Completed: "bg-green-500",
	};

	return (
		<div
			ref={(instance) => {
				dropRef(instance);
			}}
			className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
		>
			<div className="mb-3 flex w-full">
				<div className={`w-2 ${TASK_STATUS_COLOR[status]} rounded-s-lg`} />
				<div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
					<h3 className="flex items-center text-lg font-semibold dark:text-white">
						{status}{" "}
						<span
							className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
							style={{ width: "1.5rem", height: "1.5rem" }}
						>
							{taskCount}
						</span>
					</h3>
					<div className="flex items-center gap-1">
						<button
							type="button"
							className="flex h-6 w-5 items-center justify-center dark:text-neutral-500"
						>
							<EllipsisVertical size={26} />
						</button>
						<button
							type="button"
							className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
							onClick={() => setIsModalNewTaskOpen(true)}
						>
							<Plus size={16} />
						</button>
					</div>
				</div>
			</div>

			{tasks
				.filter((task) => task.status === status)
				.map((task) => (
					<Task key={task.id} task={task} />
				))}
		</div>
	);
};

type TaskProps = {
	task: TaskType;
};

const Task = ({ task }: TaskProps) => {
	const [{ isDragging }, dragRef] = useDrag(() => ({
		type: "task",
		item: { id: task.id },
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const taskTags = task.tags ? task.tags.split(",") : [];

	const formattedStartDate = task.startDate
		? new Date(task.startDate).toLocaleDateString()
		: "";

	const formattedDueDate = task.dueDate
		? new Date(task.dueDate).toLocaleDateString()
		: "";

	const commentCount = task.comments ? task.comments.length : 0;

	const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
		<div
			className={`rounded-full px-2 py-1 text-xs font-semibold ${
				priority === "Urgent"
					? "bg-red-200 text-red-700"
					: priority === "High"
						? "bg-yellow-200 text-yellow-700"
						: priority === "Medium"
							? "bg-green-200 text-green-700"
							: priority === "Low"
								? "bg-blue-200 text-blue-700"
								: "bg-gray-200 text-gray-700"
			}`}
		>
			{priority}
		</div>
	);

	return (
		<div
			ref={(instance) => {
				dragRef(instance);
			}}
			className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
				isDragging ? "opacity-50" : "opacity-100"
			}`}
		>
			{task.attachments && task.attachments.length > 0 && (
				<Image
					src={`/${task.attachments[0].fileURL}`}
					alt={task.attachments[0].fileName}
					width={400}
					height={200}
					className="h-auto w-full rounded-t-md"
				/>
			)}
			<div className="p-4 md:p-6">
				<div className="flex items-start justify-between">
					<div className="flex flex-1 flex-wrap items-center gap-2">
						{task.priority && <PriorityTag priority={task.priority} />}
						<div className="flex gap-2">
							{taskTags.map((tag) => (
								<div
									key={tag}
									className="rounded-full bg-blue-100 px-2 py-1 text-xs"
								>
									{" "}
									{tag}
								</div>
							))}
						</div>
					</div>
					<button
						type="button"
						className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
					>
						<EllipsisVertical size={26} />
					</button>
				</div>

				<div className="my-3 flex justify-between">
					<h4 className="text-md font-bold dark:text-white">{task.title}</h4>
					{typeof task.points === "number" && (
						<div className="text-xs font-semibold dark:text-white">
							{task.points} pts
						</div>
					)}
				</div>

				<div className="text-xs text-gray-500 dark:text-neutral-500">
					{formattedStartDate && <span>{formattedStartDate} - </span>}
					{formattedDueDate && <span>{formattedDueDate}</span>}
				</div>
				<p className="text-sm text-gray-600 dark:text-neutral-500">
					{task.description}
				</p>
				<div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

				{/* Users */}
				<div className="mt-3 flex items-center justify-between">
					<div className="flex -space-x-[6px] overflow-hidden">
						{task.assignee && (
							<Image
								key={task.assignee.userId}
								src={`/${task.assignee?.profilePictureUrl}`}
								alt={task.assignee.username}
								width={30}
								height={30}
								className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
							/>
						)}
						{task.author && (
							<Image
								key={task.author.userId}
								src={`/${task.author.profilePictureUrl ?? ""}`}
								alt={task.author.username}
								width={30}
								height={30}
								className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
							/>
						)}
					</div>
					<div className="flex items-center text-gray-500 dark:text-neutral-500">
						<MessageSquareMore size={20} />
						<span className="ml-1 text-sm dark:text-neutral-400">
							{commentCount}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

type BoardViewProps = {
	id: string;
	setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TASK_STATUS: string[] = [
	"To Do",
	"Work In Progress",
	"Under Review",
	"Completed",
];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
	const {
		data: tasks,
		isLoading,
		error,
	} = useGetTasksQuery({ projectId: Number(id) });

	const [updateTaskStatus] = useUpdateTaskStatusMutation();

	const moveTask = (taskId: number, status: string) => {
		updateTaskStatus({ taskId, status });
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>An error occurred while fetching tasks</div>;

	return (
		<div className="px-4 pb-8 xl:px-6">
			<div className="pt-5">
				<Header
					name="Board"
					buttonComponent={
						<button
							type="button"
							className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
							onClick={() => setIsModalNewTaskOpen(true)}
						>
							Add Task
						</button>
					}
					isSmallText
				/>
			</div>
			<DndProvider backend={HTML5Backend}>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					{TASK_STATUS.map((status) => (
						<TaskColumn
							key={status}
							status={status}
							tasks={tasks || []}
							moveTask={moveTask}
							setIsModalNewTaskOpen={setIsModalNewTaskOpen}
						/>
					))}
				</div>
			</DndProvider>
		</div>
	);
};

export default BoardView;
