import type { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.json(projects);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving projects: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        organizationId: 1,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error creating a project: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate } = req.body;
  try {
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
    res.json(updatedProject);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error updating project: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  try {
    const deletedProject = await prisma.project.update({
      where: { id: Number(projectId) },
      data: { deletedAt: new Date() },
    });
    res.json(deletedProject);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error deleting project: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};
