import prisma from "../utils/prisma";

export const createProject = async ({
  organizationId,
  name,
  description = null,
  startDate = null,
  endDate = null,
}: {
  organizationId: number;
  name: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  const project = await prisma.project.create({
    data: {
      organizationId,
      name,
      description,
      startDate,
      endDate,
    },
  });

  return project;
};

export const getProjects = async ({
  organizationId,
}: {
  organizationId: number;
}) => {
  const projects = await prisma.project.findMany({
    where: {
      AND: [{ organizationId }, { deletedAt: null }],
    },
  });

  return projects;
};

export const getProjectById = async ({
  id,
  organizationId,
  withProjectTeams = false,
}: {
  id: number;
  organizationId: number;
  withProjectTeams?: boolean;
}) => {
  const project = await prisma.project.findFirst({
    where: {
      AND: [{ id }, { organizationId }, { deletedAt: null }],
    },
    include: {
      projectTeams: withProjectTeams,
    },
  });

  return project;
};

export const getProjectByName = async ({
  name,
  organizationId,
  withProjectTeams = false,
}: {
  name: string;
  organizationId: number;
  withProjectTeams?: boolean;
}) => {
  const project = await prisma.project.findFirst({
    where: {
      AND: [{ name }, { organizationId }, { deletedAt: null }],
    },
    include: {
      projectTeams: withProjectTeams,
    },
  });

  return project;
};

export const updateProject = async ({
  id,
  organizationId,
  name,
  description = null,
  startDate = null,
  endDate = null,
}: {
  id: number;
  organizationId: number;
  name: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  const project = await prisma.project.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      startDate,
      endDate,
    },
  });

  return project;
};

export const deleteProject = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId: number;
}) => {
  await prisma.project.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
