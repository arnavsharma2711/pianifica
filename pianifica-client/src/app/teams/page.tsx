"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import Header from "@/components/Header";
import { DataTable } from "@/components/DataTable";
import type { Team } from "@/interface";
import { CirclePlus } from "lucide-react";
import Loading from "@/components/Loading";

const Teams = () => {
	const { data: teams, isLoading, isError } = useGetTeamsQuery();

	const handleTeamModel = (action: string, user?: Team) => {
		console.log(action, user);
	};

	if (isLoading) return <Loading />;
	if (isError || !teams?.success) return <div>Error fetching teams</div>;

	const teamColumns = [
		{
			header: "Team Name",
			accessorKey: "name" as keyof Team,
		},
		{
			header: "Project Manager",
			accessorKey: "teamManager" as keyof Team,
			cell: (team: Team) => team.teamManager?.username ?? "N/A",
		},
		{
			header: "Project Lead",
			accessorKey: "teamLead" as keyof Team,
			cell: (team: Team) => team.teamLead?.username ?? "N/A",
		},
	];
	return (
		<div className="flex w-full flex-col p-8">
			<Header
				name="Teams"
				buttonComponent={
					<button
						type="button"
						className="flex items-center gap-2 rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
						onClick={() => handleTeamModel("create")}
					>
						Create Team
						<CirclePlus size={16} />
					</button>
				}
			/>
			<DataTable data={teams?.data} columns={teamColumns} />
		</div>
	);
};

export default Teams;
