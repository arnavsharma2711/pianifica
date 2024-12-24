import { CustomError } from "../lib/error/custom.error";
import type { Filter } from "../lib/filters";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectByName,
  getProjects,
  updateProject,
} from "../model/project-model";
import {
  createProjectTeam,
  deleteProjectTeam,
  getProjectTeam,
} from "../model/project-team-model";
import { getTeamById } from "../model/team-model";

export const createNewProject = async ({
  name,
  organizationId,
  description = null,
  startDate = null,
  endDate = null,
}: {
  name: string;
  organizationId: number;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  const existingProject = await getExistingProject({ name, organizationId });

  if (existingProject) {
    throw new CustomError(
      400,
      "Project already exists!",
      "Project with same name already exists in the organization."
    );
  }

  const project = await createProject({
    name,
    organizationId,
    description,
    startDate,
    endDate,
  });

  return project;
};

export const getExistingProjects = async ({
  organizationId,
  filters,
}: {
  organizationId: number;
  filters: Filter;
}) => {
  const { projects, totalCount } = await getProjects({
    organizationId,
    filters,
  });

  return { projects, totalCount };
};

export const getExistingProject = async ({
  id,
  name,
  organizationId,
}: {
  id?: number;
  name?: string;
  organizationId: number;
}) => {
  let project = null;
  if (id) {
    project = await getProjectById({ id, organizationId });
  } else if (name) project = await getProjectByName({ name, organizationId });

  return project;
};

export const updateExistingProject = async ({
  id,
  name,
  organizationId,
  description = null,
  startDate = null,
  endDate = null,
}: {
  id: number;
  name: string;
  organizationId: number;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  const existingProject = await getExistingProject({ id, organizationId });

  if (!existingProject) {
    throw new CustomError(
      404,
      "Project not found!",
      "Project with the given ID not found."
    );
  }

  const projectWithSameName = await getExistingProject({
    name,
    organizationId,
  });
  if (projectWithSameName && projectWithSameName.id !== id) {
    throw new CustomError(
      400,
      "Project already exists!",
      "Project with same name already exists in the organization."
    );
  }

  const project = await updateProject({
    id,
    name,
    organizationId,
    description,
    startDate,
    endDate,
  });

  return project;
};

export const deleteExistingProject = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId: number;
}) => {
  const existingProject = await getExistingProject({ id, organizationId });

  if (!existingProject) {
    throw new CustomError(
      404,
      "Project not found!",
      "Project with the given ID not found."
    );
  }

  await deleteProject({ id, organizationId });
};

export const addNewTeam = async ({
  projectId,
  teamId,
  organizationId,
}: {
  projectId: number;
  teamId: number;
  organizationId: number;
}) => {
  const existingProject = await getExistingProject({
    id: projectId,
    organizationId,
  });

  if (!existingProject) {
    throw new CustomError(
      404,
      "Project not found!",
      "Project with the given ID not found."
    );
  }

  const existingTeam = await getTeamById({
    id: teamId,
    organizationId: existingProject.organizationId,
    withTeamMembers: "none",
  });

  if (!existingTeam) {
    throw new CustomError(
      404,
      "Team not found!",
      "Team with the given ID not found."
    );
  }

  const projectTeams = await getProjectTeam({ projectId, teamId });

  if (projectTeams) {
    throw new CustomError(
      400,
      "Team already exists in project!",
      "Team with the given ID already exists in the project."
    );
  }

  await createProjectTeam({ projectId, teamId });
};

export const removeExistingTeam = async ({
  projectId,
  teamId,
  organizationId,
}: {
  projectId: number;
  teamId: number;
  organizationId: number;
}) => {
  const existingProject = await getExistingProject({
    id: projectId,
    organizationId,
  });

  if (!existingProject) {
    throw new CustomError(
      404,
      "Project not found!",
      "Project with the given ID not found."
    );
  }

  const existingTeam = await getTeamById({
    id: teamId,
    organizationId: existingProject.organizationId,
    withTeamMembers: "none",
  });

  if (!existingTeam) {
    throw new CustomError(
      404,
      "Team not found!",
      "Team with the given ID not found."
    );
  }

  const projectTeams = await getProjectTeam({ projectId, teamId });

  if (!projectTeams) {
    throw new CustomError(
      400,
      "Team not found in project!",
      "Team with the given ID not found in the project."
    );
  }

  await deleteProjectTeam({ projectId, teamId });
};
