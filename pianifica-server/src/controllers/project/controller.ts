import controllerWrapper from "../../lib/controllerWrapper";
import {
  createNewProject,
  deleteExistingProject,
  getExistingProject,
  getExistingProjects,
  updateExistingProject,
} from "../../service/project-service";
import { getExistingProjectTasks } from "../../service/task-service";
import { isAdmin } from "../../lib/utils";
import { createProjectSchema, updateProjectSchema } from "./schema";
import { filterSchema, projectSchema, taskSchema } from "../../lib/schema";
import { getFilters } from "../../lib/filters";
import {
  createNewBookmark,
  deleteExistingBookmark,
  getUserExistingBookmarksByEntityType,
} from "../../service/bookmark-service";

// GET api/projects
export const getProjects = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to get project from the organization.",
    });
    return;
  }

  const filters = filterSchema.parse(req.query);

  const { projects, totalCount } = await getExistingProjects({
    organizationId: req.user?.organizationId,
    filters: getFilters(filters, "projects"),
  });

  let projectData: object[] = [];
  if (projects.length > 0) {
    projectData = projects.map((project) => projectSchema.parse(project));
  }
  res.success({
    message: "Projects fetched successfully.",
    data: projectData,
    total_count: totalCount,
  });
});

// GET api/project/:id
export const getProject = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to get project from the organization.",
    });
    return;
  }

  const { id } = req.params;

  const project = await getExistingProject({
    id: Number(id),
    organizationId: req.user?.organizationId,
  });
  if (!project) {
    res.invalid({
      message: "Project not found",
      error: "Project with the given ID does not exist.",
    });
    return;
  }
  const projectData = projectSchema.parse(project);

  res.success({
    message: "Projects fetched successfully.",
    data: projectData,
  });
});

// GET api/project/:id/tasks
export const getProjectTasks = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch task from the project.",
    });
    return;
  }
  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Project id is required to fetch tasks.",
    });
    return;
  }

  const tasks = await getExistingProjectTasks({
    projectId: Number(id),
    organizationId: req.user?.organizationId,
  });

  const taskData = tasks.map((task) => taskSchema.parse(task));
  res.success({
    message: "Tasks fetched successfully.",
    data: taskData,
  });
});

// POST api/project
export const createProject = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove project from the organization.",
    });
    return;
  }

  if (!isAdmin(req.user?.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove project from the organization.",
    });
    return;
  }

  const { name, description, startDate, endDate } = createProjectSchema.parse(
    req.body
  );

  const updatedProject = await createNewProject({
    organizationId: req.user?.organizationId,
    name,
    description,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
  });

  const projectData = projectSchema.parse(updatedProject);

  res.success({
    message: "Project updated successfully.",
    data: projectData,
  });
});

// PUT api/project
export const updateProject = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove project from the organization.",
    });
    return;
  }

  if (!isAdmin(req.user?.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove project from the organization.",
    });
    return;
  }

  const { id, name, description, startDate, endDate } =
    updateProjectSchema.parse(req.body);

  const updatedProject = await updateExistingProject({
    id: Number(id),
    organizationId: req.user?.organizationId,
    name,
    description,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
  });

  const projectData = projectSchema.parse(updatedProject);

  res.success({
    message: "Project updated successfully.",
    data: projectData,
  });
});

// DELETE api/project/:projectId
export const deleteProject = controllerWrapper(async (req, res) => {
  const { projectId } = req.params;

  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove project from the organization.",
    });
    return;
  }

  if (!isAdmin(req.user?.role)) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove project from the organization.",
    });
    return;
  }

  if (!projectId) {
    res.invalid({
      message: "Missing required parameter: Project ID",
      error: "Project ID is required to delete the project.",
    });
    return;
  }

  await deleteExistingProject({
    id: Number(projectId),
    organizationId: req.user?.organizationId,
  });

  res.success({ message: "Project deleted successfully." });
});

// POST api/project/:projectId/bookmark
export const bookmarkProject = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error:
        "You are not authorized to bookmark project from the organization.",
    });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Project id is required to bookmark the project.",
    });
    return;
  }

  const bookmark = await createNewBookmark({
    userId: req.user?.id,
    organizationId: req.user?.organizationId,
    entityType: "Project",
    entityId: Number(id),
  });

  res.success({
    message: "Project bookmarked successfully.",
    data: bookmark,
  });
});

// GET api/project/bookmark
export const getBookmarkProjects = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch bookmark from the organization.",
    });
    return;
  }

  const { limit, page } = req.query;

  const bookmark = await getUserExistingBookmarksByEntityType({
    userId: req.user?.id,
    entityType: "Project",
    limit: Number(limit) || undefined,
    page: Number(page) || undefined,
  });

  const projectData = bookmark?.map((project) => projectSchema.parse(project));

  res.success({
    message: "Project bookmark fetched successfully.",
    data: projectData,
  });
});

// DELETE api/project/:projectId/bookmark
export const removeBookmarkProject = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove bookmark from the organization.",
    });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Project id is required to bookmark the project.",
    });
    return;
  }

  await deleteExistingBookmark({
    userId: req.user?.id,
    entityType: "Project",
    entityId: Number(id),
  });

  res.success({
    message: "Project bookmark removed successfully.",
  });
});
