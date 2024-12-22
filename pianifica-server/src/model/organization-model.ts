import prisma from "../utils/prisma";

export const createOrganization = async ({ name }: { name: string }) => {
  return await prisma.organization.create({
    data: {
      name,
    },
  });
};

export const getOrganizations = async () => {
  return await prisma.organization.findMany({
    where: { deletedAt: null },
  });
};

export const getOrganizationById = async (id: number) => {
  return await prisma.organization.findFirst({
    where: { AND: [{ id }, { deletedAt: null }] },
  });
};

export const getOrganizationByName = async (name: string) => {
  return await prisma.organization.findFirst({
    where: { AND: [{ name }, { deletedAt: null }] },
  });
};

export const updateOrganization = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  return await prisma.organization.update({
    where: { id },
    data: { name },
  });
};

export const deleteOrganization = async ({ id }: { id: number }) => {
  return await prisma.organization.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
