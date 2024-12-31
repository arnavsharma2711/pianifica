import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";
import { getExistingUserTasks } from "../../service/task-service";
import { getFilters } from "../../lib/filters";
import {
  filterSchema,
  projectSchema,
  taskSchema,
  teamSchema,
  userInfoSchema,
} from "../../lib/schema";
import { getExistingProjects } from "../../service/project-service";
import { getExistingTeams } from "../../service/team-service";
import { getExistingUsers } from "../../service/user-service";

export const globalSearch = controllerWrapper(async (req, res) => {
  if (req.user?.id === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch task.",
    });
    return;
  }
  const filters = filterSchema.parse(req.query);

  const { tasks, totalCount: taskTotalCount } = await getExistingUserTasks({
    userId: req.user?.id,
    filters: getFilters(filters, "tasks"),
  });
  let taskData: object[] = [];
  if (tasks.length > 0) taskData = tasks.map((task) => taskSchema.parse(task));

  const { projects, totalCount: projectTotalCount } = await getExistingProjects(
    {
      organizationId: req.user?.organizationId,
      filters: getFilters(filters, "projects"),
    }
  );
  let projectData: object[] = [];
  if (projects.length > 0) {
    projectData = projects.map((project) => projectSchema.parse(project));
  }

  const { teams, totalCount: teamTotalCount } = await getExistingTeams({
    organizationId: req.user?.organizationId,
    filters: getFilters(filters, "teams"),
  });
  let teamData: object[] = [];
  if (teams.length > 0) teamData = teams.map((team) => teamSchema.parse(team));

  const { users, totalCount: userTotalCount } = await getExistingUsers({
    organizationId: req.user?.organizationId,
    filters: getFilters(filters, "users"),
  });
  const userInfo = users.map((user) => userInfoSchema.parse(user));

  res.success({
    message: "Search results fetched successfully!",
    data: {
      tasks: taskData,
      projects: projectData,
      teams: teamData,
      users: userInfo,
      total_count: {
        task: taskTotalCount,
        project: projectTotalCount,
        team: teamTotalCount,
        user: userTotalCount,
      },
    },
  });
});
