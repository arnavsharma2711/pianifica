import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";

export const search = controllerWrapper(async (req, res) => {
  const q = req.query.q as string;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  if (!q) {
    res.failure({
      message: "Missing required query parameter: 'q'",
      error: "The 'q' query parameter is required to perform the search.",
    });
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

  res.success({ data: { tasks, projects, users } });
});
