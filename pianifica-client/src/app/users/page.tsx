"use client";
import { useGetUsersQuery } from "@/state/api";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import type { User } from "@/interface";

const Users = () => {
	const { data: users, isLoading, isError } = useGetUsersQuery();

	if (isLoading) return <div>Loading...</div>;
	if (isError || !users) return <div>Error fetching users</div>;

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
		const [isOpen, setIsOpen] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		const handleButtonClick = () => {
			setIsOpen(!isOpen);
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		useEffect(() => {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);

		return (
			<div className="relative" ref={ref}>
				<button
					onClick={handleButtonClick}
					type="button"
					className="flex h-6 w-5 items-center justify-center dark:text-neutral-500"
				>
					<EllipsisVertical size={26} />
				</button>
				{isOpen && (
					<ul className="absolute z-30 left-0 -ml-20 mt-2 w-max bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md shadow-lg">
						<li className="flex flex-row gap-2 justify-end items-center font-bold text-blue-600 px-4 py-2 hover:bg-blue-100">
							Edit
							<Pencil size={20} color="#2096F3" />
						</li>
						<li className="flex flex-row gap-2 justify-end items-center font-bold text-red-600 px-4 py-2 hover:bg-red-100">
							Delete
							<Trash size={20} color="#F34234" />
						</li>
					</ul>
				)}
			</div>
		);
	};

	return (
		<div className="flex w-full flex-col p-8">
			<Header name="Users" />
			<DataTable
				data={users}
				columns={userColumns}
				withIndex={true}
				actionHeader="Actions"
				action={(user: User) => <UserAction user={user} />}
			/>
		</div>
	);
};

export default Users;
