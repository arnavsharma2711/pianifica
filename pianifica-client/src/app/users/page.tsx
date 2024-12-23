"use client";
import { useGetUsersQuery } from "@/state/api";
import Header from "@/components/Header";
import Image from "next/image";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import type { User } from "@/interface";
import DropdownMenu from "@/components/DropdownMenu";
import UserModal from "@/components/Modal/UserModal";
import { useState } from "react";
import ConfirmationModal from "@/components/Modal/ConfirmationModel";
import UserCard from "@/components/Cards/UserCard";
import Loading from "@/components/Loading";

const Users = () => {
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [modelUser, setModalUser] = useState<User | null>(null);
	const [action, setAction] = useState<"create" | "edit">("create");
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const { data: users, isLoading, isError } = useGetUsersQuery();
	const handleUserModel = (action: string, user?: User) => {
		if (action === "create") {
			setAction("create");
			setModalUser(null);
		} else if (action === "edit" && user) {
			setAction("edit");
			setModalUser(user);
		}
		setIsUserModalOpen(true);
	};

	if (isLoading) return <Loading />;
	if (isError || !users?.success) return <div>Error fetching users</div>;

	const userColumns = [
		{
			header: "Username",
			accessorKey: "username" as keyof User,
			cell: (user: User) => (
				<div className="flex flex-row items-center gap-2">
					<div className="h-9 w-9">
						<Image
							src={user.profilePictureUrl || "/default-profile-picture.webp"}
							alt={user.username}
							width={100}
							height={50}
							className="h-full rounded-full object-cover"
						/>
					</div>
					{user.username}
				</div>
			),
		},
		{
			header: "First Name",
			accessorKey: "firstName" as keyof User,
		},
		{
			header: "Last Name",
			accessorKey: "lastName" as keyof User,
		},
		{
			header: "Email",
			accessorKey: "email" as keyof User,
		},
	];

	const UserAction = ({ user }: { user: User }) => {
		const handleButtonClick2 = (str: string) => {
			if (str === "delete") {
				setModalUser(user);
				setIsConfirmationModalOpen(true);
			} else if (str === "edit") {
				handleUserModel("edit", user);
			}
		};
		return (
			<DropdownMenu
				toggle={<EllipsisVertical size={20} />}
				options={[
					{
						key: "edit",
						icon: <Pencil size={15} />,
						value: "Edit",
						onClick: () => handleButtonClick2("edit"),
						className:
							"hover:bg-blue-300 hover:text-blue-600 dark:hover:text-white dark:hover:bg-blue-700",
					},
					{
						key: "delete",
						icon: <Trash size={15} />,
						value: "Delete",
						onClick: () => handleButtonClick2("delete"),
						className:
							"hover:bg-red-100 hover:text-red-600 hover:dark:text-white dark:hover:bg-red-700",
					},
				]}
			/>
		);
	};

	return (
		<div className="flex w-full flex-col p-8">
			<ConfirmationModal
				isOpen={isConfirmationModalOpen}
				onClose={() => setIsConfirmationModalOpen(false)}
				onConfirm={() => {
					console.log("delete");
				}}
				message="Are you sure you want to delete this user?"
				component={modelUser && <UserCard user={modelUser} />}
			/>
			<UserModal
				isOpen={isUserModalOpen}
				onClose={() => setIsUserModalOpen(false)}
				user={modelUser}
				action={action}
			/>
			<Header
				name="Users"
				buttonComponent={
					<button
						type="button"
						className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
						onClick={() => handleUserModel("create")}
					>
						Add User
					</button>
				}
			/>

			<DataTable
				data={users?.data}
				columns={userColumns}
				withIndex={true}
				actionHeader="Actions"
				action={(user: User) => <UserAction user={user} />}
			/>
		</div>
	);
};

export default Users;
