"use client";

import { useGetCurrentUserQuery, useGetUsersQuery } from "@/state/api";
import Header from "@/components/Header";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import type { User } from "@/interface";
import DropdownMenu from "@/components/DropdownMenu";
import UserModal from "@/components/Modal/UserModal";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/Modal/ConfirmationModel";
import UserCard from "@/components/Cards/UserCard";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Error";
import Breadcrumb from "@/components/Breadcrumb";

const Users = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [modelUser, setModalUser] = useState<User | null>(null);
	const [action, setAction] = useState<"create" | "edit">("create");
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const { data: users, isLoading, isError } = useGetUsersQuery({ page, limit });
	const { data: currentUser } = useGetCurrentUserQuery();

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

	useEffect(() => {
		document.title = "Users - Pianifica";
	}, []);

	if (isLoading) return <Loading />;
	if (isError || !users?.success) return <ErrorComponent message="An error occurred while fetching users" />;

	const pagination = {
		page,
		limit,
		total: users.total_count || 10,
		setPage,
		setLimit,
	};

	const userColumns = [
		{
			header: "Username",
			accessorKey: "username" as keyof User,
			cell: (user: User) => {
				return user.username ? <UserCard user={user} tag={(user.role === "ORG_ADMIN" || user.role === "SUPER_ADMIN") && (
					<span className="bg-blue-300 text-blue-600 rounded-full p-1 px-2">
						ADMIN
					</span>
				)} /> : null;
			},
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
		<>
			<Breadcrumb
				links={[
					{ value: "User", link: "/users" },
				]}
			/>
			<div className="flex w-full flex-col px-8 pt-2">
				<ConfirmationModal
					isOpen={isConfirmationModalOpen}
					onClose={() => setIsConfirmationModalOpen(false)}
					onConfirm={() => {
						console.log("delete");
					}}
					message="Are you sure you want to delete this user?"
					component={modelUser && <UserCard user={modelUser} size="md" />}
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
						currentUser?.data?.role === "ORG_ADMIN" ?
							(
								<button
									type="button"
									className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
									onClick={() => handleUserModel("create")}
								>
									Add User
								</button>
							) : undefined
					}
				/>

				<DataTable
					data={users?.data}
					columns={userColumns}
					withIndex={true}
					showPagination={true}
					pagination={pagination}
					actionHeader={currentUser?.data?.role === "ORG_ADMIN" ? "Actions" : undefined}
					action={currentUser?.data?.role === "ORG_ADMIN" ? (user: User) => <UserAction user={user} /> : undefined}
				/>
			</div>
		</>
	);
};

export default Users;
