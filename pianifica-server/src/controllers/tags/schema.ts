import { z } from "zod";

export const createTagSchema = z.object({
  tag: z.string({
    required_error: "Tag name is required.",
    invalid_type_error: "Tag name must be a string.",
  }),
});

export const createTagsSchema = z.object({
  tags: z
    .array(
      z.string({
        required_error: "Tags is required.",
        invalid_type_error: "Tags must be a string.",
      })
    )
    .default([]),
});
