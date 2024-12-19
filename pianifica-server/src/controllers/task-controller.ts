import type { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
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
    res.json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving tasks: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  try {
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
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error creating a task: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  try {
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
    res.json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error updating task: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const deletedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: { deletedAt: new Date() },
    });
    res.json(deletedTask);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error deleting task: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });
    res.json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error updating task: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};
