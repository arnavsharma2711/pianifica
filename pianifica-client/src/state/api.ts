import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project, Search, Task, Team, User } from "@/interface";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
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
    getProjects: build.query<ApiResponse<Project[]>, void>({
      query: () => ({
        url: "projects",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
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
    getTasks: build.query<ApiResponse<Task[]>, { projectId: number }>({
      query: ({ projectId }) => ({
        url: `task?projectId=${projectId}`,
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
      ],
    }),
    getUsers: build.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: "users",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
      providesTags: ["Users"],
    }),
    getTeams: build.query<ApiResponse<Team[]>, void>({
      query: () => ({
        url: "teams",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      }),
      providesTags: ["Teams"],
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
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetUsersQuery,
  useGetTeamsQuery,
  useSearchTaskProjectUserQuery,
} = api;
