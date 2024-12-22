import prisma from "../utils/prisma";

const getIncludeMembers = (withTeamMembers: "data" | "mapping" | "none") => {
  switch (withTeamMembers) {
    case "data":
      return {
        include: {
          user: true,
        },
      };
    case "mapping":
      return true;
    case "none":
      return false;
    default:
      return false;
  }
};

export const createTeam = async ({
  name,
  organizationId,
  leadId = null,
  managerId = null,
}: {
  name: string;
  organizationId: number;
  leadId?: number | null;
  managerId?: number | null;
}) => {
  const team = await prisma.team.create({
    data: {
      name,
      organizationId,
      leadId,
      managerId,
    },
  });

  return team;
};

export const getTeams = async ({
  organizationId,
}: {
  organizationId: number;
}) => {
  const teams = await prisma.team.findMany({
    where: {
      AND: [{ organizationId }, { deletedAt: null }],
    },
    include: {
      teamLead: true,
      teamManager: true,
    },
  });

  return teams;
};

export const getTeamById = async ({
  id,
  organizationId,
  withTeamMembers = "data",
  withManager = false,
  withLead = false,
}: {
  id: number;
  organizationId: number;
  withTeamMembers: "data" | "mapping" | "none";
  withManager?: boolean;
  withLead?: boolean;
}) => {
  const team = await prisma.team.findFirst({
    where: {
      AND: [{ id }, { organizationId }, { deletedAt: null }],
    },
    include: {
      teamLead: withTeamMembers !== "none" || withLead,
      teamManager: withTeamMembers !== "none" || withManager,
      userTeam: getIncludeMembers(withTeamMembers),
    },
  });

  return team;
};

export const getTeamByName = async ({
  name,
  organizationId,
  withTeamMembers = "none",
}: {
  name?: string;
  organizationId: number;
  withTeamMembers: "data" | "mapping" | "none";
}) => {
  const team = await prisma.team.findFirst({
    where: {
      AND: [{ name }, { organizationId }, { deletedAt: null }],
    },
    include: {
      teamLead: withTeamMembers !== "none",
      teamManager: withTeamMembers !== "none",
      userTeam: getIncludeMembers(withTeamMembers),
    },
  });

  return team;
};

export const updateTeam = async ({
  id,
  name,
  leadId,
  managerId,
}: {
  id: number;
  organizationId: number;
  name?: string;
  leadId?: number | null;
  managerId?: number | null;
}) => {
  const team = await prisma.team.update({
    where: {
      id,
    },
    data: {
      name,
      leadId,
      managerId,
    },
  });

  return team;
};

export const deleteTeam = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId: number;
}) => {
  await prisma.team.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
