import Modal from "@/components/Modal";
import { useCreateTaskMutation, useEditTaskMutation, useGetCurrentUserQuery, useGetProjectsQuery, useGetUsersQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { Priority, Status } from "@/enum";
import InputField from "../FormFields";
import type { Task } from "@/interface";
import Dropdown from "../FormFields/dropdown";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	project?: number | null;
	task?: Task;
};

const ModalNewTask = ({ isOpen, onClose, project = null, task }: Props) => {
	const { data: currentUser } = useGetCurrentUserQuery();

	const [createTask, { isLoading: isCreateLoading }] = useCreateTaskMutation();
	const [editTask, { isLoading: isEditLoading }] = useEditTaskMutation();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<Status>(Status.TODO);
	const [priority, setPriority] = useState<Priority>(Priority.BACKLOG);
	const [tags, setTags] = useState("");
	const [startDate, setStartDate] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [authorId, setAuthorId] = useState(currentUser?.data?.id || 0);
	const [assigneeId, setAssigneeId] = useState(currentUser?.data?.id || 0);
	const [projectId, setProjectId] = useState(project || 1);
	const [error, setError] = useState("");

	const handleProjectChange = (value: string) => {
		setProjectId(Number(value));
	}

	const handleStatusChange = (value: string) => {
		setStatus(Status[value as keyof typeof Status]);
	}

	const handleAuthorChange = (value: string) => {
		setAuthorId(Number(value));
	}
	const handleAssigneeChange = (value: string) => {
		setAssigneeId(Number(value));
	}

	const { data: projects } = useGetProjectsQuery({ limit: 100, page: 1 });
	const { data: users } = useGetUsersQuery({ limit: 100, page: 1 });


	const projectOptions = projects?.data.map((project) => (
		{ value: project.id.toString() || "", label: project.name || "" }
	)) || [];

	const userOptions = users?.data.map((user) => (
		{ value: user?.id?.toString() || "", label: `${user.firstName} ${user.lastName}` || "", imgSrc: user.profilePictureUrl }
	)) || [];


	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description || "");
			setStatus(task.status || Status.TODO);
			setPriority(task.priority || Priority.BACKLOG);
			setTags(task.tags || "");
			setStartDate(task.startDate || "");
			setDueDate(task.dueDate || "");
			setAuthorId(task?.assignee?.id || 0);
			setAssigneeId(task?.author?.id || 1);
			setProjectId(task.projectId || 1);
		}
		else {
			setTitle("");
			setDescription("");
			setStatus(Status.TODO);
			setPriority(Priority.BACKLOG);
			setTags("");
			setStartDate("");
			setDueDate("");
			setAuthorId(currentUser?.data?.id || 0);
			setAssigneeId(currentUser?.data?.id || 0);
			setProjectId(project || 0);
		}
	}, [task, currentUser?.data?.id, project]);

	const handleSubmit = async () => {
		if (!title || !authorId || !projectId) {
			setError("Title, Author and Project are required");
			return;
		};

		const formattedStartDate = formatISO(new Date(startDate), {
			representation: "complete",
		});
		const formattedDueDate = formatISO(new Date(dueDate), {
			representation: "complete",
		});

		if (task) {
			await editTask({
				id: task.id,
				title,
				description,
				status,
				priority,
				tags,
				startDate: formattedStartDate,
				dueDate: formattedDueDate,
				authorId: authorId,
				assigneeId: assigneeId,
				projectId,
			});
		}
		else {
			await createTask({
				title,
				description,
				status,
				priority,
				tags,
				startDate: formattedStartDate,
				dueDate: formattedDueDate,
				authorId: authorId,
				assigneeId: assigneeId,
				projectId,
			});
		}

		onClose();
	};

	const isFormValid = () => {
		return title && authorId && projectId;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} name={task ? "Edit Task" : "New Task"}>
			<form
				className="mt-4 space-y-6"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<Dropdown
					options={projectOptions}
					value={projectId.toString()}
					setValue={handleProjectChange}
					label="Project"
					disabled={projectId !== null}
				/>
				<Dropdown
					options={userOptions}
					value={authorId.toString()}
					setValue={handleAuthorChange}
					label="Author"
					disabled={true}
				/>
				<InputField
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<InputField
					label="Description"
					type="textarea"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<div className="flex flex-row w-full gap-2">
					<Dropdown
						options={Object.values(Status).map((status) => ({ value: status, label: status.replace("_", " ") }))}
						value={status}
						setValue={handleStatusChange}
						label="Status"
					/>
					<Dropdown
						options={Object.values(Priority).map((priority) => ({ value: priority, label: priority }))}
						value={priority}
						setValue={(value) => setPriority(value as Priority)}
						label="Priority"
					/>
				</div>
				<InputField
					label="Tags (comma separated)"
					placeholder="Tags (comma separated)"
					value={tags}
					onChange={(e) => setTags(e.target.value)}
					type="text"
				/>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
					<InputField
						label="Start Date"
						placeholder="Start Date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						type="date"
					/>
					<InputField
						label="Due Date"
						placeholder="Due Date"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						type="date"
					/>
				</div>

				<Dropdown
					options={userOptions}
					value={assigneeId.toString()}
					setValue={handleAssigneeChange}
					label="Assignee"
				/>
				<span className="text-red-500">
					{error}
				</span>
				<button
					type="submit"
					className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || (isCreateLoading || isEditLoading) ? "cursor-not-allowed opacity-50" : ""
						}`}
					disabled={!isFormValid() || (isCreateLoading || isEditLoading)}
				>
					{task ? isEditLoading ? "Editing..." : "Edit Task" : isCreateLoading ? "Creating..." : "Create Task"}
					
				</button>
			</form>
		</Modal>
	);
};

export default ModalNewTask;
