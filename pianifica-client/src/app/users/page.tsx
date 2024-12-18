"use client";
import { useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

const Users = () => {
	const { data: users, isLoading, isError } = useGetUsersQuery();

	if (isLoading) return <div>Loading...</div>;
	if (isError || !users) return <div>Error fetching users</div>;

	return (
		<div className="flex w-full flex-col p-8">
			<Header name="Users" />
			<div className="overflow-x-auto relative border-2 shadow-md sm:rounded-lg">
				<table className="min-w-full text-sm text-left rtl:text-right">
					<thead className="text-xs uppercase border-b bg-gray-100 dark:bg-dark-secondary">
						<tr>
							<th className="px-6 py-3 whitespace-nowrap border-r">Username</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">
								First Name
							</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">
								Last Name
							</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">Email</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">Action</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr
								key={user.id}
								className={`${
									index % 2 === 0
										? "bg-gray-200 dark:bg-zinc-800"
										: "bg-gray-100 dark:bg-zinc-900"
								} hover:bg-gray-300 dark:hover:bg-zinc-700`}
							>
								<td className="px-6 py-4 whitespace-nowrap flex flex-row items-center gap-2">
									<div className="h-9 w-9">
										<Image
											src={user.profilePictureUrl || ""}
											alt={user.username}
											width={100}
											height={50}
											className="h-full rounded-full object-cover"
										/>
									</div>
									{user.username}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{user.firstName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
								<td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<button
										type="button"
										className={
											"h-min w-min rounded p-2 hover:bg-gray-400 dark:hover:bg-zinc-400"
										}
									>
										<EllipsisVertical className="h-6 w-6 cursor-pointer" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Users;
