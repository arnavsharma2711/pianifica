import prisma from "../utils/prisma";

export const getProjectTeam = async ({
  teamId,
  projectId,
}: {
  teamId: number;
  projectId: number;
}) => {
  const projectTeam = await prisma.projectTeam.findFirst({
    where: {
      teamId,
      projectId,
    },
  });

  return projectTeam;
};

export const getTeamProjects = async ({ teamId }: { teamId: number }) => {
  const projects = await prisma.projectTeam.findMany({
    where: {
      teamId,
    },
    include: {
      project: true,
    },
  });

  return projects;
};

export const getProjectTeams = async ({ projectId }: { projectId: number }) => {
  const teams = await prisma.projectTeam.findMany({
    where: {
      projectId,
    },
  });

  return teams;
};

export const createProjectTeam = async ({
  teamId,
  projectId,
}: {
  teamId: number;
  projectId: number;
}) => {
  const projectTeam = await prisma.projectTeam.create({
    data: {
      teamId,
      projectId,
    },
  });

  return projectTeam;
};

export const deleteProjectTeam = async ({
  teamId,
  projectId,
}: {
  teamId: number;
  projectId: number;
}) => {
  await prisma.projectTeam.delete({
    where: {
      teamId_projectId: {
        teamId,
        projectId,
      },
    },
  });
};
