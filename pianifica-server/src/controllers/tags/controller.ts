import controllerWrapper from "../../lib/controllerWrapper";
import { tagSchema } from "../../lib/schema";
import {
  createNewTag,
  createNewTags,
  deleteExistingTag,
  getExistingTags,
  updateExistingTag,
} from "../../service/tag-service";
import { createTagSchema, createTagsSchema } from "./schema";

// POST api/tags
export const createTags = controllerWrapper(async (req, res) => {
  const { tags } = createTagsSchema.parse(req.body);

  const createdTags = await createNewTags({ names: tags });

  res.success({
    message: "Tags created successfully.",
    data: createdTags,
  });
});

// POST api/tag
export const createTag = controllerWrapper(async (req, res) => {
  const { tag } = createTagSchema.parse(req.body);

  const createdTag = await createNewTag({ name: tag });

  res.success({
    message: "Tag created successfully.",
    data: createdTag,
  });
});

// GET api/tags
export const getTags = controllerWrapper(async (req, res) => {
  const tags = await getExistingTags();

  const tagData = tags.map((tag) => tagSchema.parse(tag));
  res.success({
    message: "Tags fetched successfully.",
    data: tagData,
  });
});

// PUT api/tag/:id
export const updateTag = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { tag } = createTagSchema.parse(req.body);

  const updatedTag = await updateExistingTag({ id: Number(id), name: tag });

  res.success({
    message: "Tag updated successfully.",
    data: updatedTag,
  });
});

// DELETE api/tag/:id
export const deleteTag = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  await deleteExistingTag({ id: Number(id) });

  res.success({
    message: "Tag deleted successfully.",
  });
});
