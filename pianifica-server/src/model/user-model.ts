import bcrypt from "bcrypt";
import Prisma from "../utils/prisma";

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
}: {
  organizationId: number;
}) => {
  const users = await Prisma.user.findMany({
    where: {
      AND: {
        deletedAt: null,
        organizationId,
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

  const totalCount = await Prisma.user.count({
    where: {
      AND: {
        deletedAt: null,
        organizationId,
      },
    },
  });

  return { users, totalCount };
};

export const getUserById = async ({ id }: { id: number }) => {
  const user = await Prisma.user.findFirst({
    where: {
      AND: {
        deletedAt: null,
        id,
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
