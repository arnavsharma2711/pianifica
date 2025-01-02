import { z } from "zod";
import { Priority, Status } from "@prisma/client";
import { Order } from "./filters";

export const organizationSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  name: z.string({
    required_error: "Organization name is required",
    invalid_type_error: "Organization name must be a text",
  }),
  createdAt: z.date({
    required_error: "Created at is required",
    invalid_type_error: "Created at must be a date",
  }),
  updatedAt: z.date({
    required_error: "Updated at is required",
    invalid_type_error: "Updated at must be a date",
  }),
});

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
    .url()
    .optional()
    .nullable()
    .default(null),
  role: z
    .string({
      invalid_type_error: "Role must be a text",
    })
    .optional(),
});

export const teamSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  name: z.string({
    required_error: "Team name is required",
    invalid_type_error: "Team name must be a text",
  }),
  organizationId: z.number({
    required_error: "Organization ID is required",
    invalid_type_error: "Organization ID must be a number",
  }),
  teamLead: userInfoSchema,
  teamManager: userInfoSchema,
});

export const projectSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  name: z.string({
    required_error: "Project name is required",
    invalid_type_error: "Project name must be a text",
  }),
  organizationId: z.number({
    required_error: "Organization ID is required",
    invalid_type_error: "Organization ID must be a number",
  }),
  description: z
    .string({
      invalid_type_error: "Project description must be a text",
    })
    .optional(),
  startDate: z
    .date({
      invalid_type_error: "Start date must be a date",
    })
    .optional(),
  endDate: z
    .date({
      invalid_type_error: "End date must be a date",
    })
    .optional(),
  bookmarked: z.boolean().optional(),
});

export const attachmentSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  fileName: z.string({
    required_error: "File name is required",
    invalid_type_error: "File name must be a text",
  }),
  fileUrl: z
    .string({
      required_error: "File URL is required",
      invalid_type_error: "File URL must be a text",
    })
    .url(),
});

export const commentSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  text: z.string({
    required_error: "Comment text is required",
    invalid_type_error: "Comment text must be a text",
  }),
  user: userInfoSchema.optional(),
  createdAt: z.date({
    required_error: "Created at is required",
    invalid_type_error: "Created at must be a date",
  }),
  updatedAt: z.date({
    required_error: "Updated at is required",
    invalid_type_error: "Updated at must be a date",
  }),
});

export const taskSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  title: z.string({
    required_error: "Task title is required",
    invalid_type_error: "Task title must be a text",
  }),
  description: z
    .string({
      invalid_type_error: "Task description must be a text",
    })
    .optional(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  tags: z.array(z.string()).optional(),
  startDate: z
    .date({
      invalid_type_error: "Start date must be a date",
    })
    .optional(),
  dueDate: z
    .date({
      invalid_type_error: "Due date must be a date",
    })
    .optional(),
  points: z
    .number({
      invalid_type_error: "Points must be a number",
    })
    .nullable()
    .optional(),
  projectId: z.number({
    required_error: "Project ID is required",
    invalid_type_error: "Project ID must be a number",
  }),
  project: projectSchema.optional(),
  author: userInfoSchema.optional(),
  assignee: userInfoSchema.optional(),
  attachments: z
    .union([attachmentSchema, z.array(attachmentSchema)])
    .optional(),
  comments_count: z.number().optional(),
  comments: z.union([commentSchema, z.array(commentSchema)]).optional(),
  bookmarked: z.boolean().optional(),
});

export const filterSchema = z.object({
  search: z.string().optional().nullable().default(""),
  page: z
    .union([z.string(), z.null()])
    .optional()
    .nullable()
    .transform((val) => Number.parseInt(val ?? "1", 10)),
  limit: z
    .union([z.string(), z.null()])
    .optional()
    .nullable()
    .transform((val) => Number.parseInt(val ?? "10", 10)),
  sortBy: z.string().optional().nullable().default("createdAt"),
  order: z.nativeEnum(Order).optional().nullable().default(Order.ASC),
});

export const tagSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  name: z.string({
    required_error: "Tag name is required",
    invalid_type_error: "Tag name must be a text",
  }),
});

export const mailerSchema = z.object({
  id: z.number(),
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  variables: z.record(z.string(), z.string()).optional(),
});
