"use client";
import { useGetCurrentUserQuery, useGetTeamsQuery, useRemoveTeamMutation } from "@/state/api";
import React, { useState } from "react";
import Header from "@/components/Header";
import { DataTable } from "@/components/DataTable";
import type { Team } from "@/interface";
import { CirclePlus, EllipsisVertical, Trash, UserRoundPen } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import ErrorComponent from "@/components/Error";
import Link from "next/link";
import TeamModal from "@/components/Modal/TeamModal";
import ConfirmationModal from "@/components/Modal/ConfirmationModel";
import toast from "react-hot-toast";
import DropdownMenu from "@/components/DropdownMenu";
import Breadcrumb from "@/components/Breadcrumb";

const Teams = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [modalTeam, setModalTeam] = useState<Team | null>(null);
	const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const { data: teams, isLoading, isError } = useGetTeamsQuery({ page, limit });
	const { data: currentUser } = useGetCurrentUserQuery();

	const [removeTeam] = useRemoveTeamMutation();

	const handleTeamModel = (action: string, user?: Team) => {
		setModalTeam(user || null);
		setIsTeamModalOpen(true);
	};

	const removeTeamHandler = async (teamId: number) => {
		const response = await removeTeam({ teamId });
		if (response.data?.success) {
			toast.success("User removed from team successfully");
		}
	}

	if (isLoading) return <Loading />;
	if (isError || !teams?.success)
		return <ErrorComponent message="An error occurred while fetching teams" />;

	const pagination = {
		page,
		limit,
		total: teams.total_count || 10,
		setPage,
		setLimit,
	};

	const teamColumns = [
		{
			header: "Team Name",
			accessorKey: "name" as keyof Team,
			cell: (team: Team) => (
				<Link href={`/team/${team.id}`}>{team.name}</Link>
			),
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

	const TeamActions = ({ team }: { team: Team }) => {
		const deleteTeam = () => {
			setModalTeam(team);
			setIsConfirmationModalOpen(true);
		};

		const editTeam = () => {
			setModalTeam(team);
			setIsTeamModalOpen(true);
		};

		return (
			<DropdownMenu
				toggle={<EllipsisVertical size={20} />}
				options={[
					{
						key: "edit",
						icon: <UserRoundPen size={15} />,
						value: "Edit",
						onClick: () => editTeam(),
						className:
							"hover:bg-blue-300 hover:text-blue-600 dark:hover:text-white dark:hover:bg-blue-700",
					},
					{
						key: "delete",
						icon: <Trash size={15} />,
						value: "Delete",
						onClick: () => deleteTeam(),
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
					{ value: "Teams", link: "/teams" },
				]}
			/>
			<div className="flex w-full flex-col px-8 pt-2">
				<ConfirmationModal
					isOpen={isConfirmationModalOpen}
					onClose={() => setIsConfirmationModalOpen(false)}
					onConfirm={() => {
						removeTeamHandler(modalTeam?.id || 0);
					}}
					message="Are you sure you want to remove this team?"
				/>
				<TeamModal
					isOpen={isTeamModalOpen}
					onClose={() => setIsTeamModalOpen(false)}
					action={modalTeam ? "edit" : "add"}
					team={modalTeam ?? undefined}
				/>
				<Header
					name="Teams"
					buttonComponent={
						currentUser?.data?.role === "ORG_ADMIN" ?
							(
								<button
									type="button"
									className="flex items-center gap-2 rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
									onClick={() => handleTeamModel("create")}
								>
									Create Team
									<CirclePlus size={16} />
								</button>
							) : undefined
					}
				/>
				<DataTable
					data={teams?.data}
					columns={teamColumns}
					withIndex
					showPagination={true}
					pagination={pagination}
					actionHeader={currentUser?.data?.role === "ORG_ADMIN" ? " " : undefined}
					action={currentUser?.data?.role === "ORG_ADMIN" ? (team: Team) => <TeamActions team={team} /> : undefined}
				/>
			</div>
		</>
	);
};

export default Teams;
