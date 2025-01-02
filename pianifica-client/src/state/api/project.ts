import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { Project, Task } from "@/interface";

const projectAPI = (
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
    | "Tags",
    "api"
  >,
) => ({
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
  getBookmarkedProjects: build.query<ApiResponse<Project[]>, void>({
    query: () => ({
      url: "projects/bookmark",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
  }),
  getProject: build.query<ApiResponse<Project>, { projectId: number }>({
    query: ({ projectId }) => ({
      url: `project/${projectId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
    providesTags: ["Project"],
  }),
  addBookmarkProject: build.mutation<ApiResponse<null>, { projectId: number }>({
    query: ({ projectId }) => ({
      url: `project/${projectId}/bookmark`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "POST",
    }),
    invalidatesTags: ["Project"],
  }),
  removeBookmarkProject: build.mutation<
    ApiResponse<null>,
    { projectId: number }
  >({
    query: ({ projectId }) => ({
      url: `project/${projectId}/bookmark`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: ["Project"],
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
  updateProject: build.mutation<ApiResponse<Project>, Partial<Project>>({
    query: (project) => ({
      url: "project",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "PUT",
      body: project,
    }),
    invalidatesTags: ["Project"],
  }),
  deleteProject: build.mutation<ApiResponse<null>, { projectId: number }>({
    query: ({ projectId }) => ({
      url: `project/${projectId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: ["Project"],
  }),
});

export default projectAPI;
