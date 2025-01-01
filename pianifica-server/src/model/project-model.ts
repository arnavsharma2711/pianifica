import type { Project } from "@prisma/client";
import type { Filter } from "../lib/filters";
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
  filters,
}: {
  organizationId: number;
  filters: Filter;
}) => {
  const whereClause: {
    AND: {
      deletedAt: null;
      organizationId: number;
      OR?: { name: { contains: string; mode: "insensitive" | "default" } }[];
    };
  } = {
    AND: {
      deletedAt: null,
      organizationId,
    },
  };

  if (filters.search) {
    whereClause.AND.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  const projects = await prisma.project.findMany({
    where: whereClause,
  });

  const totalCount = await prisma.project.count({
    where: whereClause,
  });

  return { projects, totalCount };
};

export const getProjectById = async ({
  id,
  organizationId,
  withProjectTeams = false,
  getBookmarks = false,
}: {
  id: number;
  organizationId: number;
  withProjectTeams?: boolean;
  getBookmarks?: boolean;
}) => {
  const project = await prisma.project.findFirst({
    where: {
      AND: [{ id }, { organizationId }, { deletedAt: null }],
    },
    include: {
      projectTeams: withProjectTeams,
    },
  });

  if (getBookmarks && project) {
    const bookmarkExists = await prisma.bookmark.findFirst({
      where: {
        entityType: "Project",
        entityId: id,
      },
    });

    return { ...project, bookmarked: !!bookmarkExists } as Project & {
      bookmarked: boolean;
    };
  }

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
