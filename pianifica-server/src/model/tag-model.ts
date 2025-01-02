import { CustomError } from "../lib/error/custom.error";
import prisma from "../utils/prisma";
import { getTagMappings } from "./tag-mapping-model";

export const createTag = async ({ name }: { name: string }) => {
  return await prisma.tag.create({
    data: {
      name,
    },
  });
};
export const createTags = async ({ names }: { names: string[] }) => {
  return await prisma.tag.createMany({
    data: names.map((name) => ({ name })),
  });
};

export const getTags = async () => {
  return await prisma.tag.findMany();
};

export const getTagsByName = async ({ names }: { names: string[] }) => {
  return await prisma.tag.findMany({
    where: { name: { in: names } },
  });
};

export const getTagByName = async ({ name }: { name: string }) => {
  return await prisma.tag.findFirst({
    where: { name },
  });
};

export const getTagById = async ({ id }: { id: number }) => {
  return await prisma.tag.findFirst({
    where: { id },
  });
};

export const updateTag = async ({ id, name }: { id: number; name: string }) => {
  return await prisma.tag.update({
    where: { id },
    data: { name },
  });
};

export const deleteTag = async ({ id }: { id: number }) => {
  const tagsMappings = await getTagMappings({ id });
  if (tagsMappings.length) {
    throw new CustomError(
      409,
      "Tag is in use",
      "Tag cannot be deleted as it is in use by some tasks"
    );
  }

  return await prisma.tag.delete({
    where: { id },
  });
};
