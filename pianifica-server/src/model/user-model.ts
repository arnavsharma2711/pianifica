import { ACCESS_TOKEN_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import Prisma from "../utils/prisma";

export const findUserById = async (id: number) => {
  const user = await Prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const generateUserToken = async (user: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  organizationId: number;
}) => {
  const access_token_payload = {
    id: user.id,
  };
  const access_token = jwt.sign(access_token_payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return { access_token };
};
