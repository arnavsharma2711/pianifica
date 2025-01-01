import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import { formatISO } from "date-fns";
import { useState } from "react";
import InputField from "../FormFields";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
	const [createProject, { isLoading }] = useCreateProjectMutation();
	const [projectName, setProjectName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const handleSubmit = async () => {
		if (!projectName || !startDate || !endDate) {
			return;
		}

		const formattedStartDate = formatISO(new Date(startDate), {
			representation: "complete",
		});
		const formattedEndDate = formatISO(new Date(endDate), {
			representation: "complete",
		});

		await createProject({
			name: projectName,
			description,
			startDate: formattedStartDate,
			endDate: formattedEndDate,
		});

		onClose();
	};

	const isFormValid = () => {
		return projectName && description && startDate && endDate;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
			<form
				className="flex flex-col gap-4 mt-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<InputField
					label="Project Name"
					value={projectName}
					onChange={(e) => setProjectName(e.target.value)}
				/>
				<InputField
					label="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					type="textarea"
				/>
				<div>
					<div className="flex flex-col sm:flex-row sm:space-x-2">
						<InputField
							label="Start Date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							type="date"
						/>
						<InputField
							label="Start Date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							type="date"
						/>
					</div>
					<p className="text-sm text-gray-500">
						Please note that the start date should be before the end date.
					</p>
				</div>
				<button
					type="submit"
					className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
						}`}
					disabled={!isFormValid() || isLoading}
				>
					{isLoading ? "Creating..." : "Create Project"}
				</button>
			</form>
		</Modal>
	);
};

export default ModalNewProject;
