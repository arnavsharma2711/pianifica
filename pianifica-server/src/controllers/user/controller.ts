import prisma from "../../utils/prisma";
import controllerWrapper from "../../lib/controllerWrapper";

export const getUsers = controllerWrapper(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: {
      updatedAt: "desc",
    },
  });

  res.success({
    message: "User fetched successfully!",
    data: users,
  });
});
