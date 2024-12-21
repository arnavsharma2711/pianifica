import type { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamsWithMangerAndLead = await prisma.team.findMany({
      include: {
        teamManager: {
          select: { username: true },
        },
        teamLead: {
          select: { username: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json(teamsWithMangerAndLead);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving teams: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};
