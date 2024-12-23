import Modal from "@/components/Modal";
import { useState, useEffect } from "react";
import InputField from "../FormFields";
import type { User } from "@/interface";
import Image from "next/image";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	action: "create" | "edit";
	user: User | null;
};

const UserModal = ({ isOpen, onClose, action = "create", user }: Props) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const isLoading = false;

	useEffect(() => {
		setUsername(user?.username || "");
		setEmail(user?.email || "");
		setFirstName(user?.firstName || "");
		setLastName(user?.lastName || "");
	}, [user]);

	const handleSubmit = async () => {
		if (!username || !email || !firstName || !lastName) {
			return;
		}

		if (action === "create") {
			// create user
			// await createUser({
			// 	username,
			// 	email,
			// 	password,
			// });
		} else {
			// update user
		}

		onClose();
	};

	const isFormValid = () => {
		return username && email && firstName && lastName;
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			name={user ? "Edit User" : "Create New User"}
		>
			<form
				className="mt-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<div className="w-full flex flex-col items-center gap-4">
					<div className="w-full flex items-center gap-4">
						<Image
							src={user?.profilePictureUrl || "/default-profile-picture.webp"}
							alt={user?.username || "User Profile Picture"}
							width={100}
							height={50}
							className="h-full rounded-full object-cover"
						/>
						<div className="flex flex-col w-full">
							<InputField
								label="First Name"
								value={firstName}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<InputField
								label="Last Name"
								value={lastName}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-col w-full">
						<InputField
							label="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<InputField
							label="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
				</div>

				<button
					type="submit"
					className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
						!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
					}`}
					disabled={!isFormValid() || isLoading}
				>
					{isLoading ? "Saving..." : user ? "Save Changes" : "Create User"}
				</button>
			</form>
		</Modal>
	);
};

export default UserModal;
