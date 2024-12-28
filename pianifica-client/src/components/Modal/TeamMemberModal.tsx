import Modal from "@/components/Modal";
import { useAddTeamMemberMutation, useGetUsersQuery } from "@/state/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Dropdown from "../FormFields/dropdown";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	teamId: number;
	teamMembersIds: number[] | undefined;
};

const TeamMemberModal = ({ isOpen, onClose, teamId, teamMembersIds }: Props) => {
	const [user, setUser] = useState(0);
	const [team, setTeam] = useState(0);
	const [addTeamMember, { isLoading }] = useAddTeamMemberMutation();
	const { data: users } = useGetUsersQuery({ limit: 100, page: 1 });

	useEffect(() => {
		setTeam(teamId);
	}, [teamId]);

	const handleSetUser = (value: string) => {
		setUser(Number(value));
	}

	const userOptions = users?.data.map((user) => (
		{ value: user?.id?.toString() || "", label: `${user.firstName} ${user.lastName}` || "", imgSrc: user.profilePictureUrl }
	)).filter(
		(user) => !teamMembersIds?.includes(Number(user.value))
	) || [];


	const handleSubmit = async () => {
		if (!team || !user) {
			return;
		}
		const response = await addTeamMember({
			teamId: team,
			userId: user,
		});

		if (response.error) {
			toast.error("An error occurred while adding user to team");
			return;
		}
		toast.success("User added to team successfully");
		onClose();
	};

	const isFormValid = () => {
		return team && user;
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			name="Add Team Member"
		>
			<form
				className="mt-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>

				<Dropdown
					options={userOptions}
					value={user.toString()}
					setValue={handleSetUser}
					label="Team Member"
				/>

				<button
					type="submit"
					className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
						}`}
					disabled={!isFormValid() || isLoading}
				>
					{isLoading ? "Saving..." : "Add Team Member"}
				</button>
			</form>
		</Modal>
	);
};

export default TeamMemberModal;
