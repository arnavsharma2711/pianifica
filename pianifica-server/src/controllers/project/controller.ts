import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";

export const getProjects = controllerWrapper(async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null, organizationId: req.user?.organizationId },
    orderBy: {
      updatedAt: "desc",
    },
  });
  res.success({ message: "Projects fetched successfully.", data: projects });
});

export const createProject = controllerWrapper(async (req, res) => {
  const { name, description, startDate, endDate, organizationId } = req.body;

  if (!name || !startDate || !endDate || !organizationId) {
    res.invalid({
      message: "Validation Error",
      error:
        "Missing required fields: Name, Start Date, End Date, and Organization ID are mandatory to create a project.",
    });
    return;
  }
  const newProject = await prisma.project.create({
    data: {
      name,
      description,
      startDate,
      endDate,
      organizationId,
    },
  });
  res.success({
    status: 201,
    message: "Project created successfully.",
    data: newProject,
  });
});

export const updateProject = controllerWrapper(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate } = req.body;

  if (!projectId) {
    res.invalid({
      message: "Missing required parameter: Project ID",
      error: "Project ID is required to update the project.",
    });
    return;
  }

  const updatedProject = await prisma.project.update({
    where: { id: Number(projectId) },
    data: {
      name,
      description,
      startDate,
      endDate,
      updatedAt: new Date(),
    },
  });

  res.success({
    message: "Project updated successfully.",
    data: updatedProject,
  });
});

export const deleteProject = controllerWrapper(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    res.invalid({
      message: "Missing required parameter: Project ID",
      error: "Project ID is required to delete the project.",
    });
    return;
  }

  const deletedProject = await prisma.project.update({
    where: { id: Number(projectId) },
    data: { deletedAt: new Date() },
  });

  res.success({
    message: "Project deleted successfully.",
    data: deletedProject,
  });
});
