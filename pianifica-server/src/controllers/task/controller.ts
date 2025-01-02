import controllerWrapper from "../../lib/controllerWrapper";
import {
  createNewTask,
  deleteExistingTask,
  getExistingTask,
  getExistingTasks,
  updateExistingTask,
  updateExistingTaskAssignedUser,
  updateExistingTaskPriority,
  updateExistingTaskStatus,
} from "../../service/task-service";
import {
  addCommentSchema,
  createTaskSchema,
  updateTaskAssigneeSchema,
  updateTaskPrioritySchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  userTaskSchema,
} from "./schema";
import { taskSchema } from "../../lib/schema";
import { getFilters } from "../../lib/filters";
import { createNewComment } from "../../service/comment-service";
import {
  createNewBookmark,
  deleteExistingBookmark,
  getUserExistingBookmarksByEntityType,
} from "../../service/bookmark-service";

export const createTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to create task for the project.",
    });
    return;
  }

  const {
    title,
    description,
    status,
    priority,
    startDate,
    dueDate,
    tags,
    points,
    projectId,
    assigneeId,
  } = createTaskSchema.parse(req.body);

  const createdTask = await createNewTask({
    organizationId: req.user?.organizationId,
    title,
    description,
    status,
    priority,
    startDate: startDate ? new Date(startDate) : null,
    dueDate: dueDate ? new Date(dueDate) : null,
    tags,
    points,
    projectId,
    authorId: req.user?.id,
    assigneeId: assigneeId || req.user?.id,
  });

  const taskData = taskSchema.parse(createdTask);
  res.success({
    message: "Task Created Successfully.",
    data: taskData,
  });
});

export const getTasks = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task for the project.",
    });
    return;
  }
  const filters = userTaskSchema.parse(req.query);

  const { tasks, totalCount } = await getExistingTasks({
    organizationId: req.user?.organizationId,
    filters: getFilters(filters, "tasks"),
  });

  let taskData: object[] = [];
  if (tasks.length > 0) taskData = tasks.map((task) => taskSchema.parse(task));
  res.success({
    message: "Tasks fetched successfully.",
    data: taskData,
    total_count: totalCount,
  });
});

export const getTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch task for the project.",
    });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Task id is required to fetch the task.",
    });
    return;
  }

  const task = await getExistingTask({
    id: Number(id),
    organizationId: req.user?.organizationId,
    withUserData: true,
    withAttachments: true,
    withComments: true,
    withBookmarks: true,
  });
  if (!task) {
    res.invalid({
      message: "Task not found",
      error: "Task with the given id not found.",
    });
    return;
  }

  const taskData = taskSchema.parse(task);
  res.success({
    message: "Task fetched successfully.",
    data: taskData,
  });
});

export const updateTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task for the project.",
    });
    return;
  }

  const {
    id,
    title,
    description,
    status,
    priority,
    startDate,
    tags,
    dueDate,
    points,
    assigneeId,
  } = updateTaskSchema.parse(req.body);

  const updatedTask = await updateExistingTask({
    id,
    organizationId: req.user?.organizationId,
    title,
    description,
    status,
    priority,
    tags,
    startDate: startDate ? new Date(startDate) : null,
    dueDate: dueDate ? new Date(dueDate) : null,
    points,
    assigneeId,
  });

  const taskData = taskSchema.parse(updatedTask);
  res.success({
    message: "Task Updated Successfully.",
    data: taskData,
  });
});

export const deleteTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task from the project.",
    });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Task id is required to delete the task.",
    });
    return;
  }

  await deleteExistingTask({
    id: Number(id),
    organizationId: req.user?.organizationId,
  });

  res.success({
    message: "Deleted Task Successfully.",
  });
});

export const addCommentToTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task from the project.",
    });
    return;
  }

  const { id } = req.params;
  const { text } = addCommentSchema.parse(req.body);
  if (!id) {
    res.invalid({
      message: "Missing required parameters: id",
      error: "Task id are required to update the task status.",
    });
    return;
  }

  const addedComment = await createNewComment({
    taskId: Number(id),
    organizationId: req.user?.organizationId,
    text,
    createdBy: req.user?.id,
  });
  res.success({
    message: "Updated Task Status Successfully.",
    data: addedComment,
  });
});

export const updateTaskStatus = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task from the project.",
    });
    return;
  }

  const { id } = req.params;
  const { status } = updateTaskStatusSchema.parse(req.body);
  if (!id) {
    res.invalid({
      message: "Missing required parameters: id",
      error: "Task id are required to update the task status.",
    });
    return;
  }

  const updatedTask = await updateExistingTaskStatus({
    id: Number(id),
    status,
    organizationId: req.user?.organizationId,
  });
  res.success({
    message: "Updated Task Status Successfully.",
    data: updatedTask,
  });
});

export const updateTaskPriority = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task from the project.",
    });
    return;
  }

  const { id } = req.params;
  const { priority } = updateTaskPrioritySchema.parse(req.body);
  if (!id) {
    res.invalid({
      message: "Missing required parameters: id",
      error: "Task id are required to update the task status.",
    });
    return;
  }

  const updatedTask = await updateExistingTaskPriority({
    id: Number(id),
    priority,
    organizationId: req.user?.organizationId,
  });
  res.success({
    message: "Updated Task Status Successfully.",
    data: updatedTask,
  });
});

export const updateTaskAssignee = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to update task from the project.",
    });
    return;
  }

  const { id } = req.params;
  const { assigneeId } = updateTaskAssigneeSchema.parse(req.body);
  if (!id) {
    res.invalid({
      message: "Missing required parameters: id",
      error: "Task id are required to update the task status.",
    });
    return;
  }

  const updatedTask = await updateExistingTaskAssignedUser({
    id: Number(id),
    assigneeId,
    organizationId: req.user?.organizationId,
  });
  res.success({
    message: "Updated Task Status Successfully.",
    data: updatedTask,
  });
});

export const getBookmarkTasks = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to fetch bookmark from the organization.",
    });
    return;
  }

  const { limit, page } = req.query;

  const bookmark = await getUserExistingBookmarksByEntityType({
    userId: req.user?.id,
    entityType: "Task",
    limit: Number(limit) || undefined,
    page: Number(page) || undefined,
  });

  const taskData = bookmark?.map((task) => taskSchema.parse(task));

  res.success({
    message: "Task bookmark fetched successfully.",
    data: taskData,
  });
});

// POST api/task/:taskId/bookmark
export const bookmarkTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to bookmark task from the organization.",
    });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Task id is required to bookmark the task.",
    });
    return;
  }

  const bookmark = await createNewBookmark({
    userId: req.user?.id,
    organizationId: req.user?.organizationId,
    entityType: "Task",
    entityId: Number(id),
  });

  res.success({
    message: "Task bookmarked successfully.",
    data: bookmark,
  });
});

// DELETE api/task/:taskId/bookmark
export const removeBookmarkTask = controllerWrapper(async (req, res) => {
  if (req.user?.organizationId === undefined) {
    res.unauthorized({
      message: "Unauthorized access",
      error: "You are not authorized to remove bookmark from the organization.",
    });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Missing required parameter: id",
      error: "Task id is required to bookmark the task.",
    });
    return;
  }

  await deleteExistingBookmark({
    userId: req.user?.id,
    entityType: "Task",
    entityId: Number(id),
  });

  res.success({
    message: "Task bookmark removed successfully.",
  });
});
