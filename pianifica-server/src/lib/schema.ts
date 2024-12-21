import { z } from "zod";

export const userInfoSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
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
  profilePictureUrl: z
    .string({
      invalid_type_error: "Profile picture URL must be a text",
    })
    .optional(),
  role: z
    .string({
      invalid_type_error: "Role must be a text",
    })
    .optional(),
});
