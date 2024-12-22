import { z } from "zod";
import { userInfoSchema } from "../../lib/schema";

export const teamWithMembersSchema = z.object({
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
  members: z.array(userInfoSchema).optional(),
});

export const teamReturnSchema = z.object({
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
  leadId: z.number({
    required_error: "Lead ID is required",
    invalid_type_error: "Lead ID must be a number",
  }),
  managerId: z.number({
    required_error: "Manager ID is required",
    invalid_type_error: "Manager ID must be a number",
  }),
});

export const createTeamSchema = z.object({
  name: z.string({
    required_error: "Team name is required",
    invalid_type_error: "Team name must be a text",
  }),
});

export const updateTeamSchema = z.object({
  id: z.number({
    required_error: "ID is required",
    invalid_type_error: "ID must be a number",
  }),
  name: z.string({
    required_error: "Team name is required",
    invalid_type_error: "Team name must be a text",
  }),
  leadId: z.number({
    required_error: "Lead ID is required",
    invalid_type_error: "Lead ID must be a number",
  }),
  managerId: z.number({
    required_error: "Manager ID is required",
    invalid_type_error: "Manager ID must be a number",
  }),
});
