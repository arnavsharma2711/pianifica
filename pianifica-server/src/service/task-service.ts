import type { Priority, Status } from "@prisma/client";
import { CustomError } from "../lib/error/custom.error";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTaskByTitle,
  getTasks,
  getUserTasks,
  updateTask,
  updateTaskAssignee,
  updateTaskPriority,
  updateTaskStatus,
} from "../model/task-model";
import { getExistingUser } from "./user-service";
import { getExistingProject } from "./project-service";

export const createNewTask = async ({
  title,
  description = "",
  organizationId,
  projectId,
  authorId,
  assigneeId,
  status = "TODO",
  priority = "BACKLOG",
  tags = null,
  startDate = null,
  dueDate = null,
  points = null,
}: {
  title: string;
  description: string | null;
  organizationId: number;
  projectId: number;
  authorId: number;
  assigneeId?: number;
  status?: Status;
  priority?: Priority;
  tags?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number | null;
}) => {
  const existingProject = await getExistingProject({
    id: projectId,
    organizationId,
  });
  if (!existingProject) {
    throw new CustomError(
      404,
      "Project not found",
      `Project with id ${projectId} does not exist in your organization`
    );
  }

  const existingTask = await getExistingTask({
    title,
    organizationId,
  });
  if (existingTask) {
    throw new CustomError(
      400,
      `Task with title ${title} already exists in project.`,
      "Task already exists"
    );
  }
  if (assigneeId) {
    const existingUser = await getExistingUser({
      id: assigneeId,
      organizationId,
    });
    if (!existingUser) {
      throw new CustomError(
        404,
        `User with id ${assigneeId} does not exist in organization with id ${organizationId}`,
        "User not found"
      );
    }
  }

  const task = await createTask({
    title,
    description,
    projectId,
    authorId,
    assigneeId,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
  });

  return task;
};

export const getExistingTasks = async ({
  projectId,
  organizationId,
}: {
  projectId: number;
  organizationId: number;
}) => {
  const tasks = await getTasks({ projectId, organizationId });

  return tasks;
};

export const getExistingUserTasks = async ({
  userId,
  filters = {},
}: {
  userId: number;
  filters?: {
    priority?: Priority | null;
    status?: Status | null;
  };
}) => {
  const tasks = await getUserTasks({ userId, filters });

  return tasks;
};

export const getExistingTask = async ({
  id,
  title,
  organizationId,
  withUserData = false,
}: {
  id?: number;
  title?: string;
  organizationId: number;
  withUserData?: boolean;
}) => {
  let task = null;
  if (id) task = await getTaskById({ id, organizationId, withUserData });
  else if (title) task = await getTaskByTitle({ title, organizationId });

  return task;
};

export const updateExistingTask = async ({
  id,
  title,
  organizationId,
  description = "",
  assigneeId = null,
  status = "TODO",
  priority = "BACKLOG",
  tags = null,
  startDate = null,
  dueDate = null,
  points = null,
}: {
  id: number;
  title: string;
  organizationId: number;
  description?: string | null;
  assigneeId?: number | null;
  status?: Status;
  priority?: Priority;
  tags?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number | null;
}) => {
  const existingTask = await getExistingTask({
    id,
    organizationId,
  });
  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${id} does not exist in organization with id ${organizationId}`,
      "Task not found"
    );
  }

  const existingTaskByTitle = await getExistingTask({
    title,
    organizationId,
  });
  if (existingTaskByTitle && existingTaskByTitle.id !== id) {
    throw new CustomError(
      400,
      `Task with title ${title} already exists in organization with id ${organizationId}`,
      "Task already exists"
    );
  }

  const updatedTask = await updateTask({
    id,
    title,
    description,
    assigneeId,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
  });

  return updatedTask;
};

export const updateExistingTaskAssignedUser = async ({
  id,
  assigneeId,
  organizationId,
}: {
  id: number;
  assigneeId: number;
  organizationId: number;
}) => {
  const existingTask = await getExistingTask({ id, organizationId });

  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${id} does not exist in organization with id ${organizationId}`,
      "Task not found"
    );
  }
  if (existingTask.assigneeId === assigneeId) {
    throw new CustomError(
      400,
      `Task with id ${id} is already assigned to user with id ${assigneeId}`,
      "Task already assigned"
    );
  }

  const existingUser = await getExistingUser({
    id: assigneeId,
    organizationId,
  });
  if (!existingUser) {
    throw new CustomError(
      404,
      "User not found",
      "Assignee User with the provided id not found in the organization."
    );
  }

  const updatedTask = await updateTaskAssignee({ id, assigneeId });
  return updatedTask;
};

export const updateExistingTaskStatus = async ({
  id,
  status,
  organizationId,
}: {
  id: number;
  status: Status;
  organizationId: number;
}) => {
  const existingTask = await getExistingTask({ id, organizationId });

  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${id} does not exist in organization with id ${organizationId}`,
      "Task not found"
    );
  }
  if (existingTask.status === status) {
    throw new CustomError(
      400,
      `Task with id ${id} is already in status ${status}`,
      "Task already in status"
    );
  }

  const updatedTask = await updateTaskStatus({ id, status });
  return updatedTask;
};

export const updateExistingTaskPriority = async ({
  id,
  priority,
  organizationId,
}: {
  id: number;
  priority: Priority;
  organizationId: number;
}) => {
  const existingTask = await getExistingTask({ id, organizationId });

  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${id} does not exist in organization with id ${organizationId}`,
      "Task not found"
    );
  }
  if (existingTask.priority === priority) {
    throw new CustomError(
      400,
      `Task with id ${id} is already in priority ${priority}`,
      "Task already in priority"
    );
  }

  const updatedTask = await updateTaskPriority({ id, priority });
  return updatedTask;
};

export const deleteExistingTask = async ({
  id,
  organizationId,
}: {
  id: number;
  organizationId: number;
}) => {
  const existingTask = await getExistingTask({ id, organizationId });

  if (!existingTask) {
    throw new CustomError(
      404,
      `Task with id ${id} does not exist in organization with id ${organizationId}`,
      "Task not found"
    );
  }

  await deleteTask({ id, organizationId });
};