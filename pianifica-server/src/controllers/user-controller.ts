import type { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving users: ${error.message}` });
    }
    res.status(500).json({ message: "An unknown error occurred" });
  }
};
