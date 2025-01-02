import { COOKIE_SETTINGS } from "../../constants";
import controllerWrapper from "../../lib/controllerWrapper";
import { userInfoSchema } from "../../lib/schema";
import {
  createNewUser,
  sendForgotPasswordMail,
  validateUserCredentials,
  verifyForgotPasswordToken,
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

// POST /api/auth/forgot-password
export const forgotPassword = controllerWrapper(async (req, res) => {
  const { emailOrUsername } = loginUserSchema.parse(req.body);

  await sendForgotPasswordMail({ emailOrUsername });
  res.success({
    message: "Forgot password request received!",
  });
});

//POST /api/auth/verify-forgot-password
export const verifyForgotPassword = controllerWrapper(async (req, res) => {
  const { newPassword, resetToken } = req.body;

  await verifyForgotPasswordToken({ newPassword, resetToken });

  res.success({
    message: "Password updated successfully!",
  });
});
