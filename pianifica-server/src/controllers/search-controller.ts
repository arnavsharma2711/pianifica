import type { Request, Response } from "express";
import prisma from "../utils/prisma";

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    if (!q) {
      res.status(400).json({ message: "Query parameter 'q' is required" });
      return;
    }

    const task = await prisma.task.findMany({
      where: {
        AND: [
          { deletedAt: null },
          {
            OR: [{ title: { contains: q } }, { description: { contains: q } }],
          },
        ],
      },
    });
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          { deletedAt: null },
          {
            OR: [{ name: { contains: q } }, { description: { contains: q } }],
          },
        ],
      },
    });
    const users = await prisma.user.findMany({
      where: {
        AND: [{ deletedAt: null }, { username: { contains: q } }],
      },
    });

    res.json({ task, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};
