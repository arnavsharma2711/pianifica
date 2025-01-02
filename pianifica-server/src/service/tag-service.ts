import { CustomError } from "../lib/error/custom.error";
import {
  createTagMappings,
  deleteTagMappings,
  getTagsByTaskId,
} from "../model/tag-mapping-model";
import {
  createTag,
  createTags,
  deleteTag,
  getTagById,
  getTagByName,
  getTags,
  getTagsByName,
  updateTag,
} from "../model/tag-model";

export const createNewTag = async ({ name }: { name: string }) => {
  const existingTag = await getTagByName({ name });
  if (existingTag) {
    throw new CustomError(
      409,
      "Tag already exists",
      `Tag with name ${name} already exists`
    );
  }

  const newTag = await createTag({ name });
  return newTag;
};

export const createNewTags = async ({ names }: { names: string[] }) => {
  const existingTags = await getTagsByName({ names });

  const remainingTags = names.filter(
    (name) => !existingTags.map((tag) => tag.name).includes(name)
  );

  const newTags = await createTags({ names: remainingTags });
  return newTags;
};

export const getExistingTags = async () => {
  return await getTags();
};

export const getExistingTag = async ({
  id,
  name,
}: {
  id?: number;
  name?: string;
}) => {
  if (id) {
    return await getTagById({ id });
  }
  if (name) {
    return await getTagByName({ name });
  }

  return null;
};

export const updateExistingTag = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  const existingTag = await getTagById({ id });
  if (!existingTag) {
    throw new CustomError(
      404,
      "Tag not found",
      `Tag with id ${id} does not exist`
    );
  }

  const updatedTag = await updateTag({ id, name });
  return updatedTag;
};

export const deleteExistingTag = async ({ id }: { id: number }) => {
  const existingTag = await getTagById({ id });
  if (!existingTag) {
    throw new CustomError(
      404,
      "Tag not found",
      `Tag with id ${id} does not exist`
    );
  }

  await deleteTag({ id });
  return existingTag;
};

export const mapTaskTags = async ({
  taskId,
  tags,
}: {
  taskId: number;
  tags: string[];
}) => {
  const getExistingTaskTags = await getTagsByTaskId({ taskId });
  const remainingTags = tags.filter(
    (tag) =>
      !getExistingTaskTags.map((taskTag) => taskTag.tag.name).includes(tag)
  );
  const deleteTags = getExistingTaskTags.filter(
    (taskTag) => !tags.includes(taskTag.tag.name)
  );
  const getTags = await getTagsByName({ names: remainingTags });
  const tagIds = getTags.map((tag) => tag.id);

  const taskTagsMapping = await createTagMappings({ tagIds, taskId });
  await deleteTagMappings({
    taskId,
    tagIds: deleteTags.map((taskTag) => taskTag.tagId),
  });
  return taskTagsMapping;
};
