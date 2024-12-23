"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import Header from "@/components/Header";
import { DataTable } from "@/components/DataTable";
import type { Team } from "@/interface";
import { CirclePlus } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import ErrorComponent from "@/components/Error";

const Teams = () => {
	const { data: teams, isLoading, isError } = useGetTeamsQuery();

	const handleTeamModel = (action: string, user?: Team) => {
		console.log(action, user);
	};

	if (isLoading) return <Loading />;
	if (isError || !teams?.success)
		return <ErrorComponent message="An error occurred while fetching teams" />;

	const teamColumns = [
		{
			header: "Team Name",
			accessorKey: "name" as keyof Team,
		},
		{
			header: "Team Manager",
			accessorKey: "teamManager" as keyof Team,
			cell: (team: Team) => (
				<div className="flex flex-row items-center gap-2">
					<div className="h-9 w-9">
						<Image
							src={
								team.teamManager?.profilePictureUrl ||
								"/default-profile-picture.webp"
							}
							alt={team.teamManager?.username || "N/A"}
							width={100}
							height={50}
							className="h-full rounded-full object-cover"
						/>
					</div>
					{team.teamManager?.firstName} {team.teamManager?.lastName}
				</div>
			),
		},
		{
			header: "Team Lead",
			accessorKey: "teamLead" as keyof Team,
			cell: (team: Team) => (
				<div className="flex flex-row items-center gap-2">
					<div className="h-9 w-9">
						<Image
							src={
								team.teamLead?.profilePictureUrl ||
								"/default-profile-picture.webp"
							}
							alt={team.teamLead?.username || "N/A"}
							width={100}
							height={50}
							className="h-full rounded-full object-cover"
						/>
					</div>
					{team.teamLead?.firstName} {team.teamLead?.lastName}
				</div>
			),
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
