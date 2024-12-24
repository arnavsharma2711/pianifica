import bcrypt from "bcrypt";
import Prisma from "../utils/prisma";
import type { Filter } from "../lib/filters";

export const createUser = async ({
  organizationId,
  firstName,
  lastName,
  email,
  username,
  password,
  profilePictureUrl = null,
}: {
  organizationId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  profilePictureUrl?: string | null;
}) => {
  const newUser = await Prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: await bcrypt.hash(password, 10),
      organizationId,
      profilePictureUrl: profilePictureUrl,
    },
  });

  return newUser;
};

export const getUsers = async ({
  organizationId,
  filters,
}: {
  organizationId: number;
  filters: Filter;
}) => {
  const whereClause: {
    AND: {
      deletedAt: null;
      organizationId: number;
      OR?: {
        username?: { contains: string };
        email?: { contains: string };
        firstName?: { contains: string };
        lastName?: { contains: string };
      }[];
    };
  } = {
    AND: {
      deletedAt: null,
      organizationId,
    },
  };

  if (filters.search) {
    whereClause.AND.OR = [
      { username: { contains: filters.search } },
      { firstName: { contains: filters.search } },
      { lastName: { contains: filters.search } },
      { email: { contains: filters.search } },
    ];
  }

  const users = await Prisma.user.findMany({
    where: whereClause,
    include: {
      userRoles: {
        select: {
          role: true,
        },
      },
    },
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
    orderBy: {
      [filters.sortBy]: filters.order,
    },
  });

  const totalCount = await Prisma.user.count({
    where: whereClause,
  });

  return { users, totalCount };
};

export const getUserById = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId?: number;
}) => {
  const queryParameters: {
    deletedAt: null;
    id: number;
    organizationId?: number;
  } = {
    deletedAt: null,
    id,
  };
  if (organizationId) queryParameters.organizationId = organizationId;

  const user = await Prisma.user.findFirst({
    where: { AND: queryParameters },
    include: {
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  return user;
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  const user = await Prisma.user.findFirst({
    where: {
      AND: {
        deletedAt: null,
        email,
      },
    },
    include: {
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  return user;
};

export const getUserByUsername = async ({
  username,
  organizationId,
}: {
  username: string;
  organizationId?: number;
}) => {
  const queryParameters: {
    deletedAt: null;
    username: string;
    organizationId?: number;
  } = {
    deletedAt: null,
    username,
  };
  if (organizationId) queryParameters.organizationId = organizationId;

  const user = await Prisma.user.findFirst({
    where: {
      AND: queryParameters,
    },
    include: {
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  return user;
};

export const updateUser = async ({
  id,
  firstName,
  lastName,
  profilePictureUrl,
}: {
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}) => {
  const updatedUser = await Prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      profilePictureUrl,
    },
  });

  return updatedUser;
};

export const deleteUser = async ({ id }: { id: number }) => {
  await Prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
