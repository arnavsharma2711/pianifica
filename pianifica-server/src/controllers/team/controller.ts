import controllerWrapper from "../../lib/controllerWrapper";
import {
  addNewTeamMember,
  createNewTeam,
  createNewTeamProject,
  deleteExistingTeam,
  deleteExistingTeamProject,
  getExistingTeam,
  getExistingTeamProjects,
  getExistingTeams,
  removeExistingTeamMember,
  updateExistingTeam,
} from "../../service/team-service";
import { filterSchema, projectSchema, teamSchema } from "../../lib/schema";
import {
  createTeamSchema,
  teamReturnSchema,
  teamWithMembersSchema,
  updateTeamSchema,
} from "./schema";
import { isAdmin } from "../../lib/utils";
import { getFilters } from "../../lib/filters";

export const getTeams = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view users",
    });
    return;
  }
  const filters = filterSchema.parse(req.query);

  const { teams, totalCount } = await getExistingTeams({
    organizationId: req.user?.organizationId,
    filters: getFilters(filters, "teams"),
  });

  let teamData: object[] = [];
  if (teams.length > 0) teamData = teams.map((team) => teamSchema.parse(team));

  res.success({
    message: "Team fetched successfully!",
    data: teamData,
    total_count: totalCount,
  });
});

export const getTeam = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view users",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  const team = await getExistingTeam({
    id: Number(id),
    organizationId: req.user?.organizationId,
    withTeamMembers: "none",
    withLead: true,
    withManager: true,
  });

  if (!team) {
    res.invalid({
      message: "Team not found",
      error: "Team with the given ID does not exist",
    });
    return;
  }

  const teamData = teamSchema.parse(team);

  res.success({
    message: "Team fetched successfully!",
    data: teamData,
  });
});

export const addTeam = controllerWrapper(async (req, res) => {
  const { name, leadId, managerId } = createTeamSchema.parse(req.body);

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to create team",
    });
    return;
  }

  if (!isAdmin(req.user?.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to create team",
    });
    return;
  }

  const team = await createNewTeam({
    name,
    organizationId: req.user?.organizationId,
    managerId,
    leadId,
  });

  res.success({
    message: "Team created successfully!",
    data: teamReturnSchema.parse(team),
  });
});

export const updateTeam = controllerWrapper(async (req, res) => {
  const { id, name, leadId, managerId } = updateTeamSchema.parse(req.body);

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to create team",
    });
    return;
  }

  if (!isAdmin(req.user?.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to create team",
    });
    return;
  }

  const team = await updateExistingTeam({
    id,
    name,
    organizationId: req.user?.organizationId,
    managerId,
    leadId,
    updatedByUserId: req.user?.id,
  });

  res.success({
    message: "Team updated successfully!",
    data: teamReturnSchema.parse(team),
  });
});

export const deleteTeam = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to delete team",
    });
    return;
  }

  if (!isAdmin(req.user?.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to delete team",
    });
    return;
  }

  await deleteExistingTeam({
    id: Number(id),
    organizationId: req.user?.organizationId,
    withoutTeamMembers: true,
    deletedByUserId: req.user?.id,
  });

  res.success({
    message: "Team deleted successfully!",
  });
});

export const addTeamMember = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to add users to team",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  if (userId === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "User ID is required",
    });
    return;
  }

  await addNewTeamMember({
    teamId: Number(id),
    userId: Number(userId),
    organizationId: req.user?.organizationId,
    addedByUserId: req.user?.id,
    isAdmin: isAdmin(req.user?.role),
  });

  res.success({
    message: "User added to team successfully!",
  });
});

export const getTeamMembers = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view users",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  const teams = await getExistingTeam({
    id: Number(id),
    organizationId: req.user?.organizationId,
    withTeamMembers: "data",
  });
  if (!teams) {
    res.invalid({
      message: "Team not found",
      error: "Team with the given ID does not exist",
    });
    return;
  }

  const teamData = teamWithMembersSchema.parse(teams);

  res.success({
    message: "Team fetched successfully!",
    data: teamData,
  });
});

export const removeTeamMember = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove user from the team",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  if (userId === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "User ID is required",
    });
    return;
  }

  await removeExistingTeamMember({
    teamId: Number(id),
    userId: Number(userId),
    organizationId: req.user?.organizationId,
    removedByUserId: req.user?.id,
    isAdmin: isAdmin(req.user?.role),
  });

  res.success({
    message: "User removed from team successfully!",
  });
});

export const addTeamProject = controllerWrapper(async (req, res) => {
  const { id, projectId } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to add projects to team",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  if (projectId === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Project ID is required",
    });
    return;
  }

  await createNewTeamProject({
    teamId: Number(id),
    projectId: Number(projectId),
    organizationId: req.user?.organizationId,
    addedByUserId: req.user?.id,
    isAdmin: isAdmin(req.user?.role),
  });

  res.success({
    message: "Project added to team successfully!",
  });
});

export const getTeamProjects = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view projects",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  console.log("id", req.user);
  const teamProjects = await getExistingTeamProjects({
    id: Number(id),
    organizationId: req.user?.organizationId,
  });

  const teamData = teamProjects.map((teamProject) =>
    projectSchema.parse(teamProject.project)
  );

  res.success({
    message: "Team fetched successfully!",
    data: teamData,
  });
});

export const removeTeamProject = controllerWrapper(async (req, res) => {
  const { id, projectId } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove projects from the team",
    });
    return;
  }

  if (id === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Team ID is required",
    });
    return;
  }

  if (projectId === undefined) {
    res.invalid({
      message: "Invalid request",
      error: "Project ID is required",
    });
    return;
  }

  await deleteExistingTeamProject({
    teamId: Number(id),
    projectId: Number(projectId),
    organizationId: req.user?.organizationId,
    removedByUserId: req.user?.id,
    isAdmin: isAdmin(req.user?.role),
  });

  res.success({
    message: "Project removed from team successfully!",
  });
});