import { z } from "zod";
import { Priority, Status } from "@prisma/client";

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "Task title is required.",
    invalid_type_error: "Task title must be a string.",
  }),
  description: z
    .string({
      invalid_type_error: "Task description must be a string.",
    })
    .nullable(),
  projectId: z.number({
    required_error: "Project ID is required.",
    invalid_type_error: "Project ID must be a number.",
  }),
  assigneeId: z
    .string({
      required_error: "Assignee ID is required.",
      invalid_type_error: "Assignee ID must be a number.",
    })
    .nullable(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  tags: z
    .string({
      invalid_type_error: "Task tags must be a string.",
    })
    .nullable(),
  startDate: z
    .string({
      invalid_type_error: "Task start date must be a date.",
    })
    .nullable(),
  dueDate: z
    .string({
      invalid_type_error: "Task due date must be a date.",
    })
    .nullable(),
  points: z
    .number({
      invalid_type_error: "Task points must be a number.",
    })
    .nullable(),
});

export const updateTaskSchema = z.object({
  id: z.number({
    required_error: "Task ID is required.",
    invalid_type_error: "Task ID must be a number.",
  }),
  title: z.string({
    required_error: "Task title is required.",
    invalid_type_error: "Task title must be a string.",
  }),
  description: z
    .string({
      invalid_type_error: "Task description must be a string.",
    })
    .nullable(),
  projectId: z.number({
    required_error: "Project ID is required.",
    invalid_type_error: "Project ID must be a number.",
  }),
  assigneeId: z
    .number({
      invalid_type_error: "Assignee ID must be a number.",
    })
    .nullable(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  tags: z
    .string({
      invalid_type_error: "Task tags must be a string.",
    })
    .nullable(),
  startDate: z
    .string({
      invalid_type_error: "Task start date must be a date.",
    })
    .nullable(),
  dueDate: z
    .string({
      invalid_type_error: "Task due date must be a date.",
    })
    .nullable(),
  points: z
    .number({
      invalid_type_error: "Task points must be a number.",
    })
    .nullable(),
});

export const userTaskSchema = z.object({
  priority: z
    .union([z.nativeEnum(Priority), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  status: z
    .union([z.nativeEnum(Status), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
});

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(Status),
});

export const updateTaskPrioritySchema = z.object({
  priority: z.nativeEnum(Priority),
});

export const updateTaskAssigneeSchema = z.object({
  assigneeId: z.number(),
});
