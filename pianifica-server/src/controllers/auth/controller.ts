import { COOKIE_SETTINGS } from "../../constants";
import controllerWrapper from "../../lib/controllerWrapper";
import { userInfoSchema } from "../../lib/schema";
import {
  createNewUser,
  validateUserCredentials,
} from "../../service/user-service";
import { loginUserSchema, registerNewUserSchema } from "./schema";

// POST /api/auth/register
export const registerNewUser = controllerWrapper(async (req, res) => {
  const {
    organizationId,
    firstName,
    lastName,
    email,
    username,
    password,
    profilePictureUrl,
  } = registerNewUserSchema.parse(req.body);

  const { accessToken, userDetails } = await createNewUser({
    organizationId,
    firstName,
    lastName,
    email,
    username,
    password,
    profilePictureUrl,
  });

  const userInfo = userInfoSchema.parse(userDetails);
  res.cookie("accessToken", accessToken, COOKIE_SETTINGS).success({
    message: "User data created successfully!",
    data: {
      accessToken,
      userInfo,
    },
  });
});

// POST /api/auth/login
export const loginUser = controllerWrapper(async (req, res) => {
  const { emailOrUsername, password } = loginUserSchema.parse(req.body);

  const { accessToken, userDetails } = await validateUserCredentials({
    emailOrUsername,
    password,
  });

  const userInfo = userInfoSchema.parse(userDetails);
  res.cookie("accessToken", accessToken, COOKIE_SETTINGS).success({
    message: "User logged in successfully!",
    data: {
      accessToken,
      userInfo,
    },
  });
});
