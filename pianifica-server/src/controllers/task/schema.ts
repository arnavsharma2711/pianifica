import { z } from "zod";
import { Priority, Status } from "@prisma/client";
import { filterSchema } from "../../lib/schema";

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "Task title is required.",
    invalid_type_error: "Task title must be a string.",
  }),
  description: z
    .string({
      required_error: "Task description is required.",
      invalid_type_error: "Task description must be a string.",
    })
    .nullable(),
  projectId: z.number({
    required_error: "Project ID is required.",
    invalid_type_error: "Project ID must be a number.",
  }),
  assigneeId: z
    .number({
      required_error: "Assignee ID is required.",
      invalid_type_error: "Assignee ID must be a number.",
    })
    .nullable(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  tags: z
    .string({
      required_error: "Task tags is required.",
      invalid_type_error: "Task tags must be a string.",
    })
    .nullable(),
  startDate: z
    .string({
      required_error: "Task start date is required.",
      invalid_type_error: "Task start date must be a date.",
    })
    .nullable(),
  dueDate: z
    .string({
      required_error: "Task due date is required.",
      invalid_type_error: "Task due date must be a date.",
    })
    .nullable(),
  points: z
    .number({
      required_error: "Task points is required.",
      invalid_type_error: "Task points must be a number.",
    })
    .nullable()
    .optional(),
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
      required_error: "Task description is required.",
      invalid_type_error: "Task description must be a string.",
    })
    .nullable(),
  projectId: z.number({
    required_error: "Project ID is required.",
    invalid_type_error: "Project ID must be a number.",
  }),
  assigneeId: z
    .number({
      required_error: "Assignee ID is required.",
      invalid_type_error: "Assignee ID must be a number.",
    })
    .nullable(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  tags: z
    .string({
      required_error: "Task tags is required.",
      invalid_type_error: "Task tags must be a string.",
    })
    .nullable(),
  startDate: z
    .string({
      required_error: "Task start date is required.",
      invalid_type_error: "Task start date must be a date.",
    })
    .nullable(),
  dueDate: z
    .string({
      required_error: "Task due date is required.",
      invalid_type_error: "Task due date must be a date.",
    })
    .nullable(),
  points: z
    .number({
      required_error: "Task points is required.",
      invalid_type_error: "Task points must be a number.",
    })
    .nullable()
    .optional(),
});

export const userTaskSchema = filterSchema.extend({
  priority: z
    .union([z.nativeEnum(Priority), z.literal(""), z.null()])
    .optional()
    .nullable(),
  status: z
    .union([z.nativeEnum(Status), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
});

export const addCommentSchema = z.object({
  text: z.string({
    required_error: "Comment text is required.",
    invalid_type_error: "Comment text must be a string.",
  }),
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
