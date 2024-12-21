import bcrypt from "bcrypt";
import Prisma from "../utils/prisma";

export const createUser = async ({
  organizationId,
  firstName,
  lastName,
  email,
  username,
  password,
  profilePictureUrl,
}: {
  organizationId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  profilePictureUrl?: string;
}) => {
  const newUser = await Prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: await bcrypt.hash(password, 10),
      organizationId,
      profilePictureUrl,
    },
  });

  return newUser;
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

export const getUserByUsername = async ({ username }: { username: string }) => {
  const user = await Prisma.user.findFirst({
    where: {
      AND: {
        deletedAt: null,
        username,
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
