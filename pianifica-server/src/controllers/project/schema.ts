import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string({
    required_error: "Project name is required.",
    invalid_type_error: "Project name must be a string.",
  }),
  description: z.string({
    required_error: "Project description is required.",
    invalid_type_error: "Project description must be a string.",
  }),
  startDate: z
    .string({
      invalid_type_error: "Project start date must be a string.",
    })
    .optional(),
  endDate: z
    .string({
      invalid_type_error: "Project end date must be a string.",
    })
    .optional(),
});

export const updateProjectSchema = z.object({
  id: z.number({
    required_error: "Project id is required.",
    invalid_type_error: "Project id must be a number.",
  }),
  name: z.string({
    required_error: "Project name is required.",
    invalid_type_error: "Project name must be a string.",
  }),
  description: z.string({
    required_error: "Project description is required.",
    invalid_type_error: "Project description must be a string.",
  }),
  startDate: z
    .string({
      invalid_type_error: "Project start date must be a string.",
    })
    .optional(),
  endDate: z
    .string({
      invalid_type_error: "Project end date must be a string.",
    })
    .optional(),
});
