import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().nonempty(),
});

export const updateOrganizationSchema = z.object({
  id: z.number().int(),
  name: z.string().nonempty(),
});
