"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import Header from "@/components/Header";

const Teams = () => {
	const { data: teams, isLoading, isError } = useGetTeamsQuery();

	if (isLoading) return <div>Loading...</div>;
	if (isError || !teams) return <div>Error fetching teams</div>;

	return (
		<div className="flex w-full flex-col p-8">
			<Header name="Teams" />
			<div className="overflow-x-auto relative border-2 shadow-md sm:rounded-lg">
				<table className="min-w-full text-sm text-left rtl:text-right">
					<thead className="text-xs uppercase border-b bg-gray-100 dark:bg-dark-secondary">
						<tr>
							<th className="px-6 py-3 whitespace-nowrap border-r">S. No.</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">
								Team Name
							</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">
								Project Manager
							</th>
							<th className="px-6 py-3 whitespace-nowrap border-r">
								Project Lead
							</th>
						</tr>
					</thead>
					<tbody>
						{teams.map((team, index) => (
							<tr
								key={team.id}
								className={`${
									index % 2 === 0
										? "bg-gray-200 dark:bg-zinc-800"
										: "bg-gray-100 dark:bg-zinc-900"
								} hover:bg-gray-300 dark:hover:bg-zinc-700`}
							>
								<td className="px-6 py-4 whitespace-nowrap border-r">
									{index + 1}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{team.name}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{team.teamManager?.username ?? "N/A"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{team.teamLead?.username ?? "N/A"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Teams;
