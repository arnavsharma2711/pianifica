import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { Project, Team } from "@/interface";

const teamAPI = (
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
  createTeam: build.mutation<ApiResponse<Team>, Partial<Team>>({
    query: (team) => ({
      url: "team",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "POST",
      body: team,
    }),
    invalidatesTags: ["Teams"],
  }),
  updateTeam: build.mutation<ApiResponse<Team>, Partial<Team>>({
    query: (team) => ({
      url: "team",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "PUT",
      body: team,
    }),
    invalidatesTags: ["Teams", "Team"],
  }),
  removeTeam: build.mutation<ApiResponse<null>, { teamId: number }>({
    query: ({ teamId }) => ({
      url: `team/${teamId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: ["Teams", "Team"],
  }),
  getTeam: build.query<ApiResponse<Team>, { teamId: number }>({
    query: ({ teamId }) => ({
      url: `team/${teamId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
    providesTags: ["Team"],
  }),
  getTeamProjects: build.query<ApiResponse<Project[]>, { teamId: number }>({
    query: ({ teamId }) => ({
      url: `team/${teamId}/projects`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
    providesTags: ["Team"],
  }),
  addTeamProject: build.mutation<
    ApiResponse<Team>,
    { teamId: number; projectId: number }
  >({
    query: ({ teamId, projectId }) => ({
      url: `team/${teamId}/project/${projectId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "POST",
    }),
    invalidatesTags: ["Teams", "Team"],
  }),
  removeTeamProject: build.mutation<
    ApiResponse<null>,
    { teamId: number; projectId: number }
  >({
    query: ({ teamId, projectId }) => ({
      url: `team/${teamId}/project/${projectId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: ["Teams", "Team"],
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
  addTeamMember: build.mutation<
    ApiResponse<Team>,
    { teamId: number; userId: number }
  >({
    query: ({ teamId, userId }) => ({
      url: `team/${teamId}/member`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      body: { userId },
      method: "POST",
    }),
    invalidatesTags: ["Teams", "Team"],
  }),
  removeTeamMember: build.mutation<
    ApiResponse<null>,
    { teamId: number; userId: number }
  >({
    query: ({ teamId, userId }) => ({
      url: `team/${teamId}/member`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
      body: { userId },
      method: "DELETE",
    }),
    invalidatesTags: ["Teams", "Team"],
  }),
});

export default teamAPI;
