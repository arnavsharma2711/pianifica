import type { Request, Response } from "express";
import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";

export const getTasks = controllerWrapper(async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    res.invalid({
      message: "Missing required parameter: Project ID",
      error: "Project ID is required to fetch tasks.",
    });
    return;
  }
  const tasks = await prisma.task.findMany({
    where: {
      projectId: Number(projectId),
      deletedAt: null,
    },
    include: {
      author: true,
      assignee: true,
      comments: true,
      attachments: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  res.success({ message: "Tasks fetched successfully.", data: tasks });
});

export const createTask = controllerWrapper(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorId,
    assigneeId,
  } = req.body;

  if (!title || !projectId || !authorId) {
    res.invalid({
      message: "Validation Error",
      error:
        "Missing required fields: Title, Project ID, and Author ID are mandatory to create a task.",
    });
    return;
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorId,
      assigneeId,
    },
  });
  res.success({
    status: 201,
    message: "Created Task Successfully.",
    data: newTask,
  });
});

export const updateTask = controllerWrapper(async (req, res) => {
  const { taskId } = req.params;
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorId,
    assigneeId,
  } = req.body;

  if (!taskId) {
    res.invalid({
      message: "Missing required parameter: Task ID",
      error: "Task ID is required to update the task.",
    });
    return;
  }

  const updatedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorId,
      assigneeId,
      updatedAt: new Date(),
    },
  });
  res.success({
    message: "Updated Task Successfully.",
    data: updatedTask,
  });
});

export const deleteTask = controllerWrapper(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    res.invalid({
      message: "Missing required parameter: Task ID",
      error: "Task ID is required to delete the task.",
    });
    return;
  }

  const deletedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: { deletedAt: new Date() },
  });
  res.success({
    message: "Deleted Task Successfully.",
    data: deletedTask,
  });
});

export const updateTaskStatus = controllerWrapper(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!taskId || !status) {
    res.invalid({
      message: "Missing required parameters: Task ID and Status",
      error: "Task ID and Status are required to update the task status.",
    });
    return;
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: Number(taskId),
    },
    data: {
      status: status,
      updatedAt: new Date(),
    },
  });
  res.success({
    message: "Updated Task Status Successfully.",
    data: updatedTask,
  });
});
