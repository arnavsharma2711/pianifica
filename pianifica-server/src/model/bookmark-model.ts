import { Prisma, type Project, type Task } from "@prisma/client";
import prisma from "../utils/prisma";

export const createBookmark = async ({
  userId,
  entityType,
  entityId,
}: {
  userId: number;
  entityType: "Task" | "Project";
  entityId: number;
}) => {
  return await prisma.bookmark.create({
    data: {
      userId,
      entityType,
      entityId,
    },
  });
};

export const getBookmark = async ({
  userId,
  entityType,
  entityId,
}: {
  userId: number;
  entityType: "Task" | "Project";
  entityId: number;
}) => {
  return await prisma.bookmark.findFirst({
    where: {
      userId,
      entityType,
      entityId,
    },
  });
};

export const getUserBookmarksByEntityType = async ({
  userId,
  entityType,
  limit = 10,
  page = 1,
}: {
  userId: number;
  entityType: "Task" | "Project";
  limit?: number;
  page?: number;
}) => {
  const entityTable = entityType === "Task" ? "Task" : "Project";

  const query = Prisma.sql`
    SELECT 
      b.*, e.*
    FROM 
      "Bookmark" b
    INNER JOIN 
      "${Prisma.raw(entityTable)}" e
    ON 
      b."entityId" = e."id"
    WHERE 
      b."userId" = ${userId} AND b."entityType" = ${entityType}
    ORDER BY 
      b."createdAt" DESC
    LIMIT ${limit}
    OFFSET ${limit * (page - 1)};
  `;

  return (await prisma.$queryRaw(query)) as (Task | Project)[];
};

export const deleteBookmark = async ({ id }: { id: number }) => {
  return await prisma.bookmark.delete({
    where: {
      id,
    },
  });
};
