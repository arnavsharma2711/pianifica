import { CustomError } from "../lib/error/custom.error";
import type { Filter } from "../lib/filters";
import {
  createProjectTeam,
  deleteProjectTeam,
  getProjectTeam,
  getTeamProjects,
} from "../model/project-team-model";
import {
  createTeam,
  deleteTeam,
  getTeamById,
  getTeamByName,
  getTeams,
  updateTeam,
} from "../model/team-model";
import {
  createTeamMember,
  deleteTeamMember,
  deleteTeamMembers,
  getTeamMembers,
} from "../model/user-team-model";
import { createNewNotification } from "./notification-service";
import { getExistingProject } from "./project-service";
import { getExistingUser } from "./user-service";

export const createNewTeam = async ({
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
  const existingTeam = await getExistingTeam({
    name,
    organizationId,
    withTeamMembers: "none",
  });

  if (existingTeam) {
    throw new CustomError(
      400,
      "Team already exists!",
      "Team with same name already exists in the organization."
    );
  }
  const team = await createTeam({
    name,
    organizationId,
    leadId,
    managerId,
  });

  return team;
};

export const createNewTeamProject = async ({
  teamId,
  projectId,
  organizationId,
  addedByUserId,
  isAdmin = false,
}: {
  teamId: number;
  projectId: number;
  organizationId: number;
  addedByUserId: number;
  isAdmin: boolean;
}) => {
  const existingMapping = await getProjectTeam({ teamId, projectId });
  if (existingMapping) {
    throw new CustomError(
      400,
      "Project already exists!",
      "Project with the provided id already exists in the team."
    );
  }

  const existingTeam = await getExistingTeam({
    id: teamId,
    organizationId: organizationId,
    withTeamMembers: "mapping",
  });
  if (!existingTeam) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }

  const existingProject = await getExistingProject({
    id: projectId,
    organizationId,
  });
  if (!existingProject) {
    throw new CustomError(
      400,
      "Project not found!",
      "Project with the provided id not found in the organization."
    );
  }

  if (existingTeam.managerId !== addedByUserId || !isAdmin) {
    throw new CustomError(
      400,
      "Unauthorized access!",
      "You are not authorized to add projects to the team."
    );
  }

  const teamProject = await createProjectTeam({ teamId, projectId });

  if (existingTeam.leadId)
    await createNewNotification({
      type: "Team",
      subType: "ProjectAssigned",
      userId: existingTeam.leadId,
      content: {
        entityId: projectId,
        entityType: "Project",
      },
    });

  await createNewNotification({
    type: "Project",
    subType: "Assigned",
    userId: existingTeam.managerId,
    content: {
      entityId: teamId,
      entityType: "Team",
    },
  });

  for (const user of existingTeam.userTeam) {
    console.log("user", user);
    await createNewNotification({
      type: "Team",
      subType: "ProjectAssigned",
      userId: user.userId,
      content: {
        entityId: projectId,
        entityType: "Project",
      },
    });
  }

  return teamProject;
};

export const getExistingTeams = async ({
  organizationId,
  filters,
}: {
  organizationId: number;
  filters: Filter;
}) => {
  const { teams, totalCount } = await getTeams({
    organizationId,
    filters,
  });

  return { teams, totalCount };
};

export const getExistingTeam = async ({
  id,
  name,
  organizationId,
  withTeamMembers = "none",
  withManager = false,
  withLead = false,
}: {
  id?: number;
  name?: string;
  organizationId: number;
  withTeamMembers: "data" | "mapping" | "none";
  withManager?: boolean;
  withLead?: boolean;
}) => {
  let team = null;
  if (id) {
    team = await getTeamById({
      id,
      organizationId,
      withTeamMembers,
      withManager,
      withLead,
    });
  } else if (name) {
    team = await getTeamByName({ name, organizationId, withTeamMembers });
  }

  let teamData = null;
  if (team && withTeamMembers) {
    teamData = {
      ...team,
      members: team?.userTeam?.map((userMapping) => userMapping?.user),
    };
  } else {
    teamData = team;
  }

  return teamData;
};

export const getExistingTeamProjects = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId: number;
}) => {
  const team = await getExistingTeam({
    id,
    organizationId,
    withTeamMembers: "none",
  });

  if (!team) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }

  const teamProjects = await getTeamProjects({ teamId: id });

  return teamProjects;
};

export const updateExistingTeam = async ({
  id,
  name,
  organizationId,
  leadId = null,
  managerId = null,
  updatedByUserId,
}: {
  id: number;
  name: string;
  organizationId: number;
  leadId?: number | null;
  managerId?: number | null;
  updatedByUserId: number;
}) => {
  const existingTeam = await getExistingTeam({
    id,
    organizationId,
    withTeamMembers: "none",
  });

  if (!existingTeam) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }
  if (existingTeam.managerId !== updatedByUserId) {
    throw new CustomError(
      400,
      "Unauthorized access!",
      "You are not authorized to update the team details."
    );
  }

  const existingTeamWithSameName = await getExistingTeam({
    name,
    organizationId,
    withTeamMembers: "none",
  });
  if (existingTeamWithSameName && existingTeamWithSameName.id !== id) {
    throw new CustomError(
      400,
      "Team already exists!",
      "Team with same name already exists in the organization."
    );
  }

  const team = await updateTeam({
    id,
    name,
    organizationId,
    leadId,
    managerId,
  });

  return team;
};

export const deleteExistingTeam = async ({
  id,
  organizationId,
  withoutTeamMembers = true,
  deletedByUserId,
}: {
  id: number;
  organizationId: number;
  withoutTeamMembers: boolean;
  deletedByUserId: number;
}) => {
  const existingTeam = await getExistingTeam({
    id,
    organizationId,
    withTeamMembers: "none",
  });

  if (!existingTeam) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }
  if (existingTeam.managerId !== deletedByUserId) {
    throw new CustomError(
      400,
      "Unauthorized access!",
      "You are not authorized to delete the team."
    );
  }

  if (withoutTeamMembers) {
    const teamMember = await getTeamMembers({ teamId: id });
    if (teamMember.length > 0) {
      throw new CustomError(
        400,
        "Team has members!",
        "Team has members. Please remove all members before deleting the team."
      );
    }
  } else {
    await deleteTeamMembers({ teamId: id });
  }

  await deleteTeam({ id, organizationId });
};

export const deleteExistingTeamProject = async ({
  teamId,
  projectId,
  organizationId,
  removedByUserId,
  isAdmin = false,
}: {
  teamId: number;
  projectId: number;
  organizationId: number;
  removedByUserId: number;
  isAdmin: boolean;
}) => {
  const existingMapping = await getProjectTeam({ teamId, projectId });
  if (!existingMapping) {
    throw new CustomError(
      400,
      "Project not found!",
      "Project with the provided id not found in the team."
    );
  }

  const existingTeam = await getExistingTeam({
    id: teamId,
    organizationId,
    withTeamMembers: "none",
  });
  if (!existingTeam) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }

  if (existingTeam.managerId !== removedByUserId || !isAdmin) {
    throw new CustomError(
      400,
      "Unauthorized access!",
      "You are not authorized to remove projects from the team."
    );
  }

  await deleteProjectTeam({ teamId, projectId });
};

export const addNewTeamMember = async ({
  userId,
  teamId,
  organizationId,
  addedByUserId,
  isAdmin = false,
}: {
  userId: number;
  teamId: number;
  organizationId: number;
  addedByUserId: number;
  isAdmin: boolean;
}) => {
  const existingTeam = await getExistingTeam({
    id: teamId,
    organizationId,
    withTeamMembers: "mapping",
  });

  if (!existingTeam) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }
  if (
    existingTeam.managerId !== addedByUserId ||
    existingTeam.managerId !== addedByUserId ||
    !isAdmin
  ) {
    throw new CustomError(
      400,
      "Unauthorized access!",
      "You are not authorized to add new members to the team."
    );
  }
  if (existingTeam.leadId === userId) {
    throw new CustomError(
      400,
      "Lead already exists!",
      "User with the provided id is already the lead of the team."
    );
  }
  if (existingTeam.managerId === userId) {
    throw new CustomError(
      400,
      "Manager already exists!",
      "User with the provided id is already the manager of the team."
    );
  }
  if (existingTeam.userTeam.some((user) => user.userId === userId)) {
    throw new CustomError(
      400,
      "User already exists!",
      "User with the provided id is already a member of the team."
    );
  }

  const existingUser = await getExistingUser({ id: userId, organizationId });
  if (!existingUser) {
    throw new CustomError(
      400,
      "User not found!",
      "User with the provided id not found in the organization."
    );
  }

  const userTeam = await createTeamMember({ teamId, userId });

  await createNewNotification({
    type: "Team",
    subType: "Assigned",
    userId,
    content: {
      entityId: teamId,
      entityType: "Team",
    },
  });

  return userTeam;
};

export const removeExistingTeamMember = async ({
  userId,
  teamId,
  organizationId,
  removedByUserId,
  isAdmin = false,
}: {
  userId: number;
  teamId: number;
  organizationId: number;
  removedByUserId: number;
  isAdmin: boolean;
}) => {
  const existingTeam = await getExistingTeam({
    id: teamId,
    organizationId,
    withTeamMembers: "mapping",
  });

  if (!existingTeam) {
    throw new CustomError(
      400,
      "Team not found!",
      "Team with the provided id not found in the organization."
    );
  }

  if (existingTeam.managerId !== removedByUserId && !isAdmin) {
    throw new CustomError(
      400,
      "Unauthorized access!",
      "You are not authorized to remove members from the team."
    );
  }

  if (existingTeam.leadId === userId) {
    throw new CustomError(
      400,
      "Lead cannot be removed!",
      "Lead of the team cannot be removed."
    );
  }

  if (existingTeam.managerId === userId) {
    throw new CustomError(
      400,
      "Manager cannot be removed!",
      "Manager of the team cannot be removed."
    );
  }

  if (!existingTeam.userTeam.some((user) => user.userId === userId)) {
    throw new CustomError(
      400,
      "User not found!",
      "User with the provided id is not a member of the team."
    );
  }

  const existingUser = await getExistingUser({ id: userId });
  if (!existingUser || existingUser.organizationId !== organizationId) {
    throw new CustomError(
      400,
      "User not found!",
      "User with the provided id not found in the organization."
    );
  }

  const userTeam = await deleteTeamMember({ teamId, userId });

  return userTeam;
};
