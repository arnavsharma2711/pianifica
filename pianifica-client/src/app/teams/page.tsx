"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import Header from "@/components/Header";
import { DataTable } from "@/components/DataTable";
import type { Team } from "@/interface";

const Teams = () => {
	const { data: teams, isLoading, isError } = useGetTeamsQuery();

	if (isLoading) return <div>Loading...</div>;
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
			<Header name="Teams" />
			<DataTable data={teams?.data} columns={teamColumns} />
		</div>
	);
};

export default Teams;
