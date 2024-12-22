import prisma from "../utils/prisma";

export const getTeamMembers = async ({ teamId }: { teamId: number }) => {
  const userTeams = await prisma.userTeam.findMany({
    where: {
      teamId,
    },
  });

  return userTeams;
};

export const getUserTeams = async ({ userId }: { userId: number }) => {
  const userTeams = await prisma.userTeam.findMany({
    where: {
      userId,
    },
  });

  return userTeams;
};

export const createTeamMember = async ({
  teamId,
  userId,
}: {
  teamId: number;
  userId: number;
}) => {
  const userTeam = await prisma.userTeam.create({
    data: {
      teamId,
      userId,
    },
  });

  return userTeam;
};

export const deleteTeamMember = async ({
  teamId,
  userId,
}: {
  teamId: number;
  userId: number;
}) => {
  const userTeam = await prisma.userTeam.delete({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });

  return userTeam;
};

export const deleteTeamMembers = async ({ teamId }: { teamId: number }) => {
  const userTeams = await prisma.userTeam.deleteMany({
    where: {
      teamId,
    },
  });

  return userTeams;
};
