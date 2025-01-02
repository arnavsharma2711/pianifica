import { z } from "zod";

export const createMailerSchema = z.object({
  id: z.number().optional(),
  title: z.string().nonempty(),
  subject: z.string().nonempty(),
  content: z.string().nonempty(),
  variables: z.record(z.string(), z.string()).optional(),
});

export const previewMailerSchema = z.object({
  receiverMail: z.string().nonempty(),
  variables: z.record(z.string(), z.string()).optional(),
});
