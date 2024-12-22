import controllerWrapper from "../../lib/controllerWrapper";
import {
  addNewTeamMember,
  createNewTeam,
  deleteExistingTeam,
  getExistingTeam,
  getExistingTeams,
  removeExistingTeamMember,
  updateExistingTeam,
} from "../../service/team-service";
import { teamSchema } from "../../lib/schema";
import {
  createTeamSchema,
  teamReturnSchema,
  teamWithMembersSchema,
  updateTeamSchema,
} from "./schema";
import { isAdmin } from "../../lib/utils";

export const getTeams = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to view users",
    });
    return;
  }

  const teams = await getExistingTeams({
    organizationId: req.user?.organizationId,
  });

  const teamData = teams.map((team) => teamSchema.parse(team));

  res.success({
    message: "Team fetched successfully!",
    data: teamData,
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
  const { name } = createTeamSchema.parse(req.body);

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
    managerId: req.user?.id,
    leadId: req.user?.id,
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
