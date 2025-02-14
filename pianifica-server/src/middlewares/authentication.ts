import jwt, { type JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants";
import { CustomError } from "../lib/error/custom.error";
import controllerWrapper from "../lib/controllerWrapper";
import { getExistingUser } from "../service/user-service";
import { userInfoSchema } from "../lib/schema";

export const authenticationMiddleware = controllerWrapper(
  async (req, res, next) => {
    const { accessToken } = req.cookies || {};
    const authorization = req.header("Authorization") || "";
    const access_token = accessToken || authorization.replace("Bearer ", "");

    if (!access_token) {
      throw new CustomError(401, "Unauthorized", "Invalid Access Token");
    }

    const decodedToken = jwt.verify(
      access_token,
      ACCESS_TOKEN_SECRET
    ) as JwtPayload;
    const userDetails = await getExistingUser({ id: decodedToken?.id });

    if (!userDetails) {
      throw new CustomError(401, "Unauthorized", "Invalid Access Token");
    }

    const userInfo = userInfoSchema.parse(userDetails);
    req.user = userInfo;
    next();
  }
);
