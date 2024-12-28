"use client";

import UserCard from "@/components/Cards/UserCard";
import { DataTable } from "@/components/DataTable";
import ErrorComponent from "@/components/Error";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ConfirmationModal from "@/components/Modal/ConfirmationModel";
import TeamMemberModal from "@/components/Modal/TeamMemberModal";
import type { User } from "@/interface";
import { useGetTeamMemberQuery, useRemoveTeamMemberMutation } from "@/state/api";
import { CirclePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  params: Promise<{ id: string }>;
};

const Team = ({ params }: Props) => {
  const [id, setId] = useState<string | null>(null);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modelUser, setModalUser] = useState<User | null>(null);

  const { data: team, isLoading, isError } = useGetTeamMemberQuery(
    { teamId: Number(id) },
    { skip: id === null }
  );
  const [removeTeamMember] = useRemoveTeamMemberMutation();

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  if (isLoading) return <Loading />;
  if (isError || !team?.success) return <ErrorComponent message="An error occurred while fetching users" />;


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
          {(user.role === "ORG_ADMIN" || user.role === "SUPER_ADMIN") && (
            <span className="bg-blue-300 text-blue-600 rounded-full px-2">
              ADMIN
            </span>
          )}
          {(user.id === team.data.teamLead?.id) && (
            <span className="bg-yellow-300 text-yellow-600 rounded-full px-2">
              LEAD
            </span>
          )}
          {(user.id === team.data.teamManager?.id) && (
            <span className="bg-pink-300 text-pink-600 rounded-full px-2">
              MANAGER
            </span>
          )}
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

  const TeamMemberAction = ({ user }: { user: User }) => {
    const deleteTeamMember = () => {
      setModalUser(user);
      setIsConfirmationModalOpen(true);
    };
    return (
      <button
        type="button"
        onClick={deleteTeamMember}
        className={"p-2 rounded-full hover:bg-red-200 dark:hover:bg-zinc-700 text-red-600"}
      >
        <Trash size={15} />
      </button>
    );
  };

  const removeTeamMemberHandler = async (userId: number) => {
    const response = await removeTeamMember({ teamId: Number(id), userId });
    if (response.data?.success) {
      toast.success("User removed from team successfully");
    }
  }

  return (
    <div className="flex w-full flex-col p-8">
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => {
          removeTeamMemberHandler(modelUser?.id || 0);
        }}
        message="Are you sure you want to remove this user from team?"
        component={modelUser && <UserCard user={modelUser} />}
      />
      <TeamMemberModal
        isOpen={isTeamMemberModalOpen}
        onClose={() => setIsTeamMemberModalOpen(false)}
        teamId={Number(id)}
        teamMembersIds={team?.data.members?.map((member) => member.id).filter((id): id is number => id !== undefined) || []}
      />
      <Header
        name={team?.data.name || ""}
      />
      <Header
        name="Team List"
        buttonComponent={
          <button
            type="button"
            className="flex items-center gap-2 rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsTeamMemberModalOpen(true)}
          >
            Add Team Member
            <CirclePlus size={16} />
          </button>
        }
        isSmallText
      />
      <DataTable
        data={team?.data?.members || []}
        columns={userColumns}
        withIndex={true}
        actionHeader="Actions"
        action={(user: User) => <TeamMemberAction user={user} />}
      />
    </div>
  );
};

export default Team;
