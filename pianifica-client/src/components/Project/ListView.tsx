import Header from "@/components/Header";
import TaskCard from "../Cards/TaskCard";
import type { Task } from "@/interface";
import { useGetProjectTasksQuery } from "@/state/api";
import React from "react";
import Loading from "../Loading";
import ErrorComponent from "../Error";

type ListViewProps = {
	id: string;
	handleTaskModel: (action: string, task?: Task) => void;
};

const ListView = ({ id, handleTaskModel }: ListViewProps) => {
	const {
		data: tasks,
		error,
		isLoading,
	} = useGetProjectTasksQuery({ projectId: Number(id) });

	if (isLoading) return <Loading />;
	if (error)
		return <ErrorComponent message={"An error occurred while fetching task"} />;

	return (
		<div className="px-4 pb-8 xl:px-6">
			<div className="pt-5">
				<Header
					name="List"
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
			{tasks?.data?.length === 0 ? (
				<div className="text-center mt-5">No Task Assigned to the project</div>
			) : (
				<div className="flex flex-col">
					{tasks?.data?.map((task: Task) => (
						<TaskCard key={task.id} task={task} />
					))}
				</div>
			)}
		</div>
	);
};

export default ListView;
