"use client";

import { DataTable } from "@/components/DataTable";
import ErrorComponent from "@/components/Error";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import type { User } from "@/interface";
import { useGetTeamMemberQuery } from "@/state/api";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const Team = ({ params }: Props) => {
  const [id, setId] = useState<string | null>(null);
  const { data: team, isLoading, isError } = useGetTeamMemberQuery(
    { teamId: Number(id) },
    { skip: id === null }
  );

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  const handleTeamMemberModel = (action: string, user?: User) => {
    console.log(action, user);
  };

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

  return (
    <div className="flex w-full flex-col p-8">
      <Header
        name={team?.data.name || ""}
      />

      <Header
        name="Team List"
        buttonComponent={
          <button
            type="button"
            className="flex items-center gap-2 rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => handleTeamMemberModel("create")}
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
      />
    </div>
  );
};

export default Team;
