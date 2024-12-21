import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";

export const getTeams = controllerWrapper(async (req, res) => {
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

  res.success({
    message: "Team fetched successfully!",
    data: teamsWithMangerAndLead,
  });
});
