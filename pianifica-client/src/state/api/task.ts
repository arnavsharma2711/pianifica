import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { Task } from "@/interface";
import type { Priority, Status } from "@/enum";

const taskAPI = (
  build: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    | "Users"
    | "User"
    | "Projects"
    | "Project"
    | "Teams"
    | "Team"
    | "Tasks"
    | "Task"
    | "UserTasks"
    | "Notifications"
    | "Tags",
    "api"
  >,
) => ({
  getTasks: build.query<
    ApiResponse<Task[]>,
    {
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: string;
      priority?: Priority;
      status?: Status;
    }
  >({
    query: ({ search, page, limit, sortBy, order, priority, status }) => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);
      if (priority) params.append("priority", priority.toUpperCase());
      if (status) params.append("status", status.toUpperCase());

      return {
        url: `tasks?${params.toString()}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      };
    },
    providesTags: ["Tasks"],
  }),
  getBookmarkedTasks: build.query<ApiResponse<Task[]>, void>({
    query: () => ({
      url: "tasks/bookmark",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
  }),
  getTask: build.query<ApiResponse<Task>, { taskId: number }>({
    query: ({ taskId }) => ({
      url: `task/${taskId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
    providesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
  }),
  createTask: build.mutation<ApiResponse<Task>, Partial<Task>>({
    query: (task) => ({
      url: "task",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "POST",
      body: task,
    }),
    invalidatesTags: ["Tasks"],
  }),
  updateTask: build.mutation<ApiResponse<Task>, Partial<Task>>({
    query: (task) => ({
      url: "task",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "PUT",
      body: task,
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: "Tasks", id },
      { type: "Task", id },
    ],
  }),
  createComment: build.mutation<
    ApiResponse<Comment>,
    { taskId: number; text: string }
  >({
    query: ({ taskId, text }) => ({
      url: `task/${taskId}/comment`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "POST",
      body: { text },
    }),
    invalidatesTags: (result, error, { taskId }) => [
      { type: "Task", id: taskId },
    ],
  }),
  addBookmarkTask: build.mutation<ApiResponse<null>, { taskId: number }>({
    query: ({ taskId }) => ({
      url: `task/${taskId}/bookmark`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "POST",
    }),
    invalidatesTags: ["Task"],
  }),
  removeBookmarkTask: build.mutation<ApiResponse<null>, { taskId: number }>({
    query: ({ taskId }) => ({
      url: `task/${taskId}/bookmark`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: ["Task"],
  }),
  updateTaskStatus: build.mutation<
    ApiResponse<Task>,
    { taskId: number; status: string }
  >({
    query: ({ taskId, status }) => ({
      url: `task/${taskId}/status`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "PATCH",
      body: { status },
    }),
    invalidatesTags: (result, error, { taskId }) => [
      { type: "Tasks", id: taskId },
      { type: "Task", id: taskId },
    ],
  }),
  updateTaskPriority: build.mutation<
    ApiResponse<Task>,
    { taskId: number; priority: string }
  >({
    query: ({ taskId, priority }) => ({
      url: `task/${taskId}/priority`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "PATCH",
      body: { priority },
    }),
    invalidatesTags: (result, error, { taskId }) => [
      { type: "Tasks", id: taskId },
      { type: "Task", id: taskId },
    ],
  }),
  updateTaskAssignee: build.mutation<
    ApiResponse<Task>,
    { taskId: number; assignedUser: number }
  >({
    query: ({ taskId, assignedUser }) => ({
      url: `task/${taskId}/assignedUser`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "PATCH",
      body: { assignedUser },
    }),
    invalidatesTags: (result, error, { taskId }) => [
      { type: "Tasks", id: taskId },
      { type: "Task", id: taskId },
    ],
  }),
  deleteTask: build.mutation<ApiResponse<null>, { taskId: number }>({
    query: ({ taskId }) => ({
      url: `task/${taskId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: (result, error, { taskId }) => [
      { type: "Task", id: taskId },
    ],
  }),
});

export default taskAPI;
