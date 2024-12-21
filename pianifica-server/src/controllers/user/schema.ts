import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
    invalid_type_error: "First name must be a text",
  }),
  lastName: z.string({
    required_error: "Last name is required",
    invalid_type_error: "Last name must be a text",
  }),
  profilePictureUrl: z
    .string({
      invalid_type_error: "Profile picture URL must be a text",
    })
    .optional(),
});

export const updateUserPasswordSchema = z.object({
  old_password: z.string({
    required_error: "Old password is required",
    invalid_type_error: "Old password must be a text",
  }),
  new_password: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "New password must be a text",
    })
    .refine((value: string) => value.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
});
