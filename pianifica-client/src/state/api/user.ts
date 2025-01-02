import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { Task, User } from "@/interface";
import type { Priority, Status } from "@/enum";

const userAPI = (
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
  getCurrentUser: build.query<ApiResponse<User>, void>({
    query: () => ({
      url: "user",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
  }),
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
        url: `user/tasks?${params.toString()}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken") || undefined,
        },
      };
    },
    providesTags: ["UserTasks"],
  }),
  getUser: build.query<ApiResponse<User>, { username: string }>({
    query: ({ username }) => ({
      url: `user/${username}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
  }),
  updateUser: build.mutation<
    ApiResponse<User>,
    { id: number; data: Partial<User> }
  >({
    query: ({ id, data }) => ({
      url: `user/${id}`,
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
    invalidatesTags: ["Users", "User"],
  }),
  deleteUser: build.mutation<ApiResponse<null>, { id: number }>({
    query: ({ id }) => ({
      url: `user/${id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken") || undefined,
      },
    }),
    invalidatesTags: ["Users", "User"],
  }),
});

export default userAPI;
