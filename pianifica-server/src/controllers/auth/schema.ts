import { z } from "zod";

export const registerNewUserSchema = z.object({
  organizationId: z.number({
    required_error: "Organization ID is required",
    invalid_type_error: "Organization ID must be a number",
  }),
  firstName: z.string({
    required_error: "First name is required",
    invalid_type_error: "First name must be a text",
  }),
  lastName: z.string({
    required_error: "Last name is required",
    invalid_type_error: "Last name must be a text",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a text",
    })
    .email({ message: "Invalid email address" }),
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a text",
  }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a text",
    })
    .refine((value: string) => value.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
  profilePictureUrl: z
    .string({
      invalid_type_error: "Profile picture URL must be a text",
    })
    .optional(),
});

export const loginUserSchema = z.object({
  emailOrUsername: z.string({
    required_error: "Email/username is required",
    invalid_type_error: "Email/username must be a text",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a text",
  }),
});
