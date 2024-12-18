import Modal from "@/components/Modal";
import { useCreateTaskMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";
import { Priority, Status } from "@/enum";
import InputField from "../FormFields";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
	const [createTask, { isLoading }] = useCreateTaskMutation();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<Status>(Status.TODO);
	const [priority, setPriority] = useState<Priority>(Priority.BACKLOG);
	const [tags, setTags] = useState("");
	const [startDate, setStartDate] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [authorUserId, setAuthorUserId] = useState("");
	const [assignedUserId, setAssignedUserId] = useState("");
	const [projectId, setProjectId] = useState(id || "");

	const handleSubmit = async () => {
		if (!title || !authorUserId || !projectId) return;

		const formattedStartDate = formatISO(new Date(startDate), {
			representation: "complete",
		});
		const formattedDueDate = formatISO(new Date(dueDate), {
			representation: "complete",
		});

		await createTask({
			title,
			description,
			status,
			priority,
			tags,
			startDate: formattedStartDate,
			dueDate: formattedDueDate,
			authorUserId: Number.parseInt(authorUserId),
			assignedUserId: Number.parseInt(assignedUserId),
			projectId: Number(projectId),
		});

		onClose();
	};

	const isFormValid = () => {
		return title && authorUserId && projectId;
	};

	const selectStyles =
		"mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:focus:outline-none";

	return (
		<Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
			<form
				className="mt-4 space-y-6"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				{id !== null && (
					<InputField
						label="Project"
						value={projectId}
						onChange={(e) => setProjectId(e.target.value)}
						type="text"
					/>
				)}
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
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
					<select
						className={selectStyles}
						value={status}
						onChange={(e) =>
							setStatus(Status[e.target.value as keyof typeof Status])
						}
					>
						<option value={Status.BLOCKED}>Blocked</option>
						<option value={Status.TODO}>To Do</option>
						<option value={Status.IN_PROGRESS}>In Progress</option>
						<option value={Status.UNDER_REVIEW}>Under Review</option>
						<option value={Status.RELEASE_READY}>Release Ready</option>
						<option value={Status.COMPLETED}>Completed</option>
					</select>
					<select
						className={selectStyles}
						value={priority}
						onChange={(e) =>
							setPriority(Priority[e.target.value as keyof typeof Priority])
						}
					>
						<option value={Priority.BACKLOG}>Backlog</option>
						<option value={Priority.LOW}>Low</option>
						<option value={Priority.MEDIUM}>Medium</option>
						<option value={Priority.HIGH}>High</option>
						<option value={Priority.URGENT}>Urgent</option>
					</select>
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
				<InputField
					label="Assigned Author"
					placeholder="Author User ID"
					value={authorUserId}
					onChange={(e) => setAuthorUserId(e.target.value)}
					type="text"
				/>
				<InputField
					label="Assigned User"
					placeholder="Assigned User ID"
					value={assignedUserId}
					onChange={(e) => setAssignedUserId(e.target.value)}
					type="text"
				/>

				<button
					type="submit"
					className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
						!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
					}`}
					disabled={!isFormValid() || isLoading}
				>
					{isLoading ? "Creating..." : "Create Task"}
				</button>
			</form>
		</Modal>
	);
};

export default ModalNewTask;
