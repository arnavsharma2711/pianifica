import { useGetTasksQuery } from "@/state/api";
import type React from "react";
import Header from "@/components/Header";
import type { Task } from "@/interface";

interface TaskTableProps {
	tasks: Task[];
	onEdit: (id: number) => void;
}
const Table = ({ tasks, onEdit }: TaskTableProps) => {
	return (
		<div className="relative border-2 overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left  rtl:text-right dark:text-white">
				<thead className="text-xs uppercase border-b bg-gray-100 dark:bg-dark-secondary dark:text-white">
					<tr>
						<th className="px-6 py-3 border-r">ID</th>
						<th className="px-6 py-3 border-r">Title</th>
						<th className="px-6 py-3 border-r">Status</th>
						<th className="px-6 py-3 border-r">Priority</th>
						<th className="px-6 py-3 border-r">Tags</th>
						<th className="px-6 py-3 border-r">Start Date</th>
						<th className="px-6 py-3 border-r">Due Date</th>
						<th className="px-6 py-3 border-r">Points</th>
						<th className="px-6 py-3 border-r">Actions</th>
					</tr>
				</thead>
				<tbody>
					{tasks.map((task: Task, index) => (
						<tr
							key={task.id}
							className={`${index % 2 === 0 ? "bg-gray-200 dark:bg-zinc-800" : "bg-gray-100 dark:bg-zinc-900"} hover:bg-gray-300 dark:hover:bg-zinc-700`}
						>
							<td className="px-6 py-4">{task.id}</td>
							<td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{task.status || "N/A"}
							</td>
							<td className="px-6 py-4">{task.priority || "N/A"}</td>
							<td className="px-6 py-4">{task.tags || "No tags"}</td>
							<td className="px-6 py-4">
								{task.startDate
									? new Date(task.startDate).toLocaleDateString()
									: "N/A"}
							</td>
							<td className="px-6 py-4">
								{task.dueDate
									? new Date(task.dueDate).toLocaleDateString()
									: "N/A"}
							</td>
							<td className="px-6 py-4">{task.points || "N/A"}</td>
							<td className="px-6 py-4">
								<button
									type="button"
									onClick={() => onEdit(task.id)}
									className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
								>
									Edit
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

type TableViewProps = {
	id: string;
	setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TableView = ({ id, setIsModalNewTaskOpen }: TableViewProps) => {
	const {
		data: tasks,
		error,
		isLoading,
	} = useGetTasksQuery({ projectId: Number(id) });

	if (isLoading) return <div>Loading...</div>;
	if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

	return (
		<div className="px-4 pb-8 xl:px-6">
			<div className="pt-5">
				<Header
					name="Table"
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
				<Table tasks={tasks} onEdit={() => {}} />
			</div>
		</div>
	);
};

export default TableView;
