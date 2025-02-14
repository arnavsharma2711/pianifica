"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ProjectCard from "@/components/Cards/ProjectCard";
import UserCard from "@/components/Cards/UserCard";
import { DataTable } from "@/components/DataTable";
import ErrorComponent from "@/components/Error";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ConfirmationModal from "@/components/Modal/ConfirmationModel";
import TeamMemberModal from "@/components/Modal/TeamMemberModal";
import type { Project, User } from "@/interface";
import { useGetCurrentUserQuery, useGetTeamMemberQuery, useGetTeamProjectsQuery, useRemoveTeamMemberMutation, useRemoveTeamProjectMutation } from "@/state/api";
import { CirclePlus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  params: Promise<{ id: string }>;
};

const Team = ({ params }: Props) => {
  const [id, setId] = useState<string | null>(null);
  const [teamList, setTeamList] = useState<User[]>([]);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isConfirmationModalOpen2, setIsConfirmationModalOpen2] = useState(false);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: team, isLoading, isError } = useGetTeamMemberQuery(
    { teamId: Number(id) },
    { skip: id === null }
  );
  const { data: projectList, isLoading: projectListLoading } = useGetTeamProjectsQuery({ teamId: Number(id) }, { skip: Number(id) === 0 })

  const [removeTeamMember] = useRemoveTeamMemberMutation();
  const [removeTeamProject] = useRemoveTeamProjectMutation();

  useEffect(() => {
    if (team?.data) {
      const { teamLead, teamManager, members = [] } = team.data;
      const list = [
        ...(teamManager ? [teamManager] : []),
        ...(teamLead ? [teamLead] : []),
        ...members,
      ];
      setTeamList(list);
    }
  }, [team]);
  useEffect(() => {
    document.title = `${team?.data?.name} - Pianifica` || "Task - Pianifica";
  }, [team]);
  if (isLoading) return <Loading />;
  if (isError || !team?.success) return <ErrorComponent message="An error occurred while fetching users" />;

  const userColumns = [
    {
      header: "Username",
      accessorKey: "username" as keyof User,
      cell: (user: User) => {
        return user.username ? (
          <UserCard
            user={user}
            tag={
              <>
                {user.id === team.data.teamLead?.id && (
                  <span className="bg-yellow-300 text-yellow-600 rounded-full p-1 px-2">
                    LEAD
                  </span>
                )}
                {user.id === team.data.teamManager?.id && (
                  <span className="bg-pink-300 text-pink-600 rounded-full p-1 px-2">
                    MANAGER
                  </span>
                )}
              </>
            }
          />
        ) : null;
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

  const TeamMemberAction = ({ user }: { user: User }) => {
    const deleteTeamMember = () => {
      setModalUser(user);
      setIsConfirmationModalOpen(true);
    };
    return (
      (user.id === team.data.teamLead?.id || user.id === team.data.teamManager?.id) ? (
        null
      ) : (
        <button
          type="button"
          onClick={deleteTeamMember}
          className="p-2 rounded-full hover:bg-red-200 dark:hover:bg-zinc-700 text-red-600"
        >
          <Trash size={15} />
        </button>
      )
    );
  };

  const removeTeamMemberHandler = async (userId: number) => {
    const response = await removeTeamMember({ teamId: Number(id), userId });
    if (response.data?.success) {
      toast.success("User removed from team successfully");
      setTeamList((prevList) => prevList.filter((user) => user.id !== userId));
    }
  }

  const projectColumns = [
    {
      header: "Project Name",
      accessorKey: "name" as keyof Project,
      cell: (project: Project) => (
        <Link href={`/project/${project.id}`}>{project.name}</Link>
      ),
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Project,
    },
    {
      header: "Start Date",
      accessorKey: "startDate" as keyof Project,
      cell: (project: Project) =>
        project.startDate
          ? new Date(project.startDate).toLocaleDateString()
          : "N/A",
    },
    {
      header: "End Date",
      accessorKey: "endDate" as keyof Project,
      cell: (project: Project) =>
        project.startDate
          ? new Date(project.startDate).toLocaleDateString()
          : "N/A",
    },
  ];

  const TeamProjectAction = ({ project }: { project: Project }) => {
    const deleteTeamProject = () => {
      setModalProject(project);
      setIsConfirmationModalOpen2(true);
    };
    return (
      (currentUser?.data.id === team.data.teamLead?.id || currentUser?.data.id === team.data.teamManager?.id) && (
        <button
          type="button"
          onClick={deleteTeamProject}
          className="p-2 rounded-full hover:bg-red-200 dark:hover:bg-zinc-700 text-red-600"
        >
          <Trash size={15} />
        </button>
      )
    );
  }

  const removeTeamProjectHandler = async (projectId: string) => {
    const response = await removeTeamProject({ teamId: Number(id), projectId: Number(projectId) });
    if (response.data?.success) {
      toast.success("Project removed from team successfully");
    }
  }
  return (
    <>
      <Breadcrumb
        links={[
          { value: "Teams", link: "/teams" },
          { value: team?.data.name || "", link: `/team/${team?.data.id}` },
        ]}
      />
      <div className="flex w-full flex-col px-8 pt-2">
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {
            removeTeamMemberHandler(modalUser?.id || 0);
          }}
          message="Are you sure you want to remove this user from team?"
          component={modalUser && <UserCard user={modalUser} />}
        />
        <ConfirmationModal
          isOpen={isConfirmationModalOpen2}
          onClose={() => setIsConfirmationModalOpen2(false)}
          onConfirm={() => {
            removeTeamProjectHandler(modalProject?.id || "");
          }}
          message="Are you sure you want to remove this project from team?"
          component={modalProject && <ProjectCard project={modalProject} />}
        />
        <TeamMemberModal
          isOpen={isTeamMemberModalOpen}
          onClose={() => setIsTeamMemberModalOpen(false)}
          teamId={Number(id)}
          teamMembersIds={teamList.map((member) => member.id).filter((id): id is number => id !== undefined) || []}
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
          data={teamList}
          columns={userColumns}
          withIndex={true}
          actionHeader=" "
          action={(user: User) => <TeamMemberAction user={user} />}
        />
        {
          projectListLoading ? <Loading /> : (<div className="flex flex-col mt-6">
            <Header
              name="Assigned Projects"
              buttonComponent={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                  onClick={() => setIsTeamMemberModalOpen(true)}
                >
                  Assignee Project
                  <CirclePlus size={16} />
                </button>
              }
              isSmallText
            />
            <DataTable
              data={projectList?.data || []}
              columns={projectColumns}
              withIndex={true}
              actionHeader=" "
              action={(project: Project) => <TeamProjectAction project={project} />}
            />
          </div>
          )
        }
      </div>
    </>
  );
};

export default Team;
