import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Comment, Project, Search, Task, Team, User } from "@/interface";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { Priority, Status } from "@/enum";
import toast from "react-hot-toast";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  error?: string;
  total_count?: number;
  data: T;
};

export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const errorMessage =
      (result.error.data as { error?: string })?.error ||
      "Server not reachable";
    toast.error(errorMessage);
  } else if (result.data && !(result.data as ApiResponse<unknown>).success) {
    toast.error(
      (result.data as ApiResponse<unknown>).error || "Something went wrong",
    );
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithErrorHandling,
  reducerPath: "api",
  tagTypes: [
    "Projects",
    "Tasks",
    "Task",
    "UserTasks",
    "Users",
    "Teams",
    "Team",
  ],
  endpoints: (build) => ({
    getUserOrganization: build.query<
      ApiResponse<{ id: number; name: string }>,
      void
    >({
      query: () => ({
        url: "user/organization",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
    }),
    getCurrentUser: build.query<ApiResponse<User>, void>({
      query: () => ({
        url: "user",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
    }),
    loginUser: build.mutation<
      ApiResponse<{ accessToken: string; userInfo: User }>,
      { emailOrUsername: string; password: string }
    >({
      query: ({ emailOrUsername, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { emailOrUsername, password },
      }),
      invalidatesTags: ["Projects", "Tasks", "Users", "Teams"],
    }),
    registerUser: build.mutation<
      ApiResponse<{ accessToken: string; userInfo: User }>,
      {
        organizationId: number;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
      }
    >({
      query: ({
        organizationId,
        firstName,
        lastName,
        username,
        email,
        password,
      }) => ({
        url: "auth/register",
        method: "POST",
        body: {
          organizationId,
          firstName,
          lastName,
          username,
          email,
          password,
        },
      }),
      invalidatesTags: ["Projects", "Tasks", "Users", "Teams"],
    }),
    getProjects: build.query<
      ApiResponse<Project[]>,
      {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
      }
    >({
      query: ({ search, page, limit, sortBy, order }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        return {
          url: `projects?${params.toString()}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("accessToken") || undefined,
          },
        };
      },
      providesTags: ["Projects"],
    }),
    getProject: build.query<ApiResponse<Project>, { projectId: number }>({
      query: ({ projectId }) => ({
        url: `project/${projectId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<ApiResponse<Project>, Partial<Project>>({
      query: (project) => ({
        url: "project",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getProjectTasks: build.query<ApiResponse<Task[]>, { projectId: number }>({
      query: ({ projectId }) => ({
        url: `project/${projectId}/tasks`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks" }],
    }),
    getUserTasks: build.query<
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
      providesTags: ["UserTasks"],
    }),
    getTask: build.query<ApiResponse<Task>, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `task/${taskId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
      providesTags: (result, error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
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
    getUsers: build.query<
      ApiResponse<User[]>,
      {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
      }
    >({
      query: ({ search, page, limit, sortBy, order }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        return {
          url: `users?${params.toString()}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("accessToken") || undefined,
          },
        };
      },
      providesTags: ["Users"],
    }),
    getTeams: build.query<
      ApiResponse<Team[]>,
      {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
      }
    >({
      query: ({ search, page, limit, sortBy, order }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        return {
          url: `teams?${params.toString()}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("accessToken") || undefined,
          },
        };
      },
      providesTags: ["Teams"],
    }),
    getTeamMember: build.query<ApiResponse<Team>, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `team/${teamId}/members`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
      providesTags: ["Team"],
    }),
    searchTaskProjectUser: build.query<ApiResponse<Search>, string>({
      query: (query) => ({
        url: `search?q=${query}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
    }),
  }),
});

export const {
  useGetUserOrganizationQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetCurrentUserQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useGetProjectTasksQuery,
  useGetUserTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useCreateCommentMutation,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTeamMemberQuery,
  useSearchTaskProjectUserQuery,
} = api;
