import type { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    if (!q) {
      res.status(400).json({ message: "Query parameter 'q' is required" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        AND: [
          { deletedAt: null },
          {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });

    const projects = await prisma.project.findMany({
      where: {
        AND: [
          { deletedAt: null },
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { deletedAt: null },

          {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });

    res.json({ tasks, projects, users });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving projects: ${error.message}` });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
