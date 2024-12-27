import Header from "@/components/Header";
import { Status } from "@/enum";
import type { Task as TaskType } from "@/interface";
import {
	useGetProjectTasksQuery,
	useUpdateTaskStatusMutation,
} from "@/state/api";
import { MessageSquareMore, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
	DndProvider,
	type DragSourceMonitor,
	type DropTargetMonitor,
	useDrag,
	useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Loading from "../Loading";
import ErrorComponent from "../Error";
import TaskViewModal from "../Modal/TaskViewModal";
import PriorityTag from "../PriorityTag";

type TaskColumnProps = {
	status: Status;
	tasks: TaskType[];
	moveTask: (taskId: number, status: string) => void;
	handleTaskModel: (action: string, task?: TaskType) => void;
	setSelectedTaskId: (id: number) => void;
};

const TaskColumn = ({
	status,
	tasks,
	moveTask,
	handleTaskModel,
	setSelectedTaskId,
}: TaskColumnProps) => {
	const [{ isOver }, dropRef] = useDrop(() => ({
		accept: "task",
		drop: (item: { id: number }) => moveTask(item.id, status),
		collect: (monitor: DropTargetMonitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	const taskCount = tasks.filter((task) => task.status === status).length;

	const TASK_STATUS_COLOR: { [key in Status]: string } = {
		[Status.BLOCKED]: "bg-gray-500",
		[Status.TODO]: "bg-red-500",
		[Status.IN_PROGRESS]: "bg-yellow-500",
		[Status.UNDER_REVIEW]: "bg-blue-500",
		[Status.RELEASE_READY]: "bg-purple-500",
		[Status.COMPLETED]: "bg-green-500",
	};

	return (
		<div
			ref={(instance) => {
				dropRef(instance);
			}}
			className={`sl:py-4 rounded-lg py-2 xl:px-2 bg-blue-100 dark:bg-neutral-900 ${isOver ? "bg-blue-200 dark:bg-neutral-950" : ""}`}
		>
			<div className="mb-3 flex w-full">
				<div className={`w-2 ${TASK_STATUS_COLOR[status]} rounded-s-lg`} />
				<div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
					<h3 className="flex items-center text-lg font-semibold">
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
							className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary"
							onClick={() => handleTaskModel("create")}
						>
							<Plus size={16} />
						</button>
					</div>
				</div>
			</div>

			{tasks
				.filter((task) => task.status === status)
				.map((task) => (
					<Task key={task.id} task={task} handleTaskModel={handleTaskModel} setSelectedTaskId={setSelectedTaskId} />
				))}
		</div>
	);
};

type TaskProps = {
	task: TaskType;
	handleTaskModel: (action: string, task?: TaskType) => void;
	setSelectedTaskId: (id: number) => void;
};

const Task = ({ task, setSelectedTaskId }: TaskProps) => {
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

	const commentCount = task.comments_count ?? 0;

	return (
		<div
			ref={(instance) => {
				dragRef(instance);
			}}
			className={`mb-4 rounded-md cursor-pointer bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : "opacity-100"
				}`}
			onClick={() => {
				setSelectedTaskId(task.id);
			}}
			onKeyUp={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					setSelectedTaskId(task.id);
				}
			}}
		>
			{task.attachments && task.attachments.length > 0 && (
				<Image
					src={task.attachments[0].fileUrl || "/default-attachment.webp"}
					alt={task.attachments[0].fileName}
					width={400}
					height={200}
					className="h-auto w-full rounded-t-md"
				/>
			)}
			<div className="p-4 md:p-6">
				<div className="flex items-start justify-between">
					<div className="flex flex-1 flex-wrap items-center gap-2">
						<div className="w-full flex justify-between">
							<h4 className="text-md font-bold">{task.title}</h4>
							<div>
								{task.priority && <PriorityTag priority={task.priority} />}
							</div>
						</div>
						<div className="flex gap-2">
							{taskTags.map((tag) => (
								<div
									key={tag}
									className="rounded-full bg-blue-100 px-2 py-1 text-xs"
								>
									{tag}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="w-full text-right text-xs text-gray-500 dark:text-neutral-500">
					{formattedStartDate && <span>{formattedStartDate} - </span>}
					{formattedDueDate && <span>{formattedDueDate}</span>}
				</div>
				<div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

				{/* Users */}
				<div className="mt-3 flex items-center justify-between">
					<div className="flex -space-x-[6px] overflow-hidden">
						{task.assignee && (
							<Image
								key={task.assignee.id}
								src={
									task.assignee.profilePictureUrl ||
									"/default-profile-picture.webp"
								}
								alt={task.assignee.username}
								width={30}
								height={30}
								className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
							/>
						)}
						{task.author && task.assignee?.id !== task.author?.id && (
							<Image
								key={task.author.id}
								src={
									task.author.profilePictureUrl ||
									"/default-profile-picture.webp"
								}
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
	handleTaskModel: (action: string, task?: TaskType) => void;
};

const TASK_STATUS: Status[] = [
	Status.BLOCKED,
	Status.TODO,
	Status.IN_PROGRESS,
	Status.UNDER_REVIEW,
	Status.RELEASE_READY,
	Status.COMPLETED,
];

const BoardView = ({ id, handleTaskModel }: BoardViewProps) => {
	const {
		data: tasks,
		isLoading,
		error,
	} = useGetProjectTasksQuery({ projectId: Number(id) });

	const [updateTaskStatus] = useUpdateTaskStatusMutation();

	const [taskId, setTaskId] = useState<number>(0);
	const [taskViewModal, setTaskViewModal] = useState(false);

	const setSelectedTaskId = (id: number) => {
		setTaskId(id);
		setTaskViewModal(true);
	}


	const moveTask = (taskId: number, status: string) => {
		updateTaskStatus({ taskId, status });
	};

	if (isLoading) return <Loading />;
	if (error)
		return <ErrorComponent message={"An error occurred while fetching task"} />;

	return (
		<div className="px-4 pb-8 xl:px-6">
			<TaskViewModal taskId={taskId} isOpen={taskViewModal} onClose={() => setTaskViewModal(false)} />
			<div className="pt-5">
				<Header
					name="Board"
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
			</div>
			<DndProvider backend={HTML5Backend}>
				<div className="overflow-x-auto">
					<div className="grid grid-cols-6 gap-4 min-w-max">
						{TASK_STATUS.map((status) => (
							<TaskColumn
								key={status}
								status={status}
								tasks={tasks?.data || []}
								moveTask={moveTask}
								handleTaskModel={handleTaskModel}
								setSelectedTaskId={setSelectedTaskId}
							/>
						))}
					</div>
				</div>
			</DndProvider>
		</div>
	);
};

export default BoardView;
