import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { User } from "@/interface";

const authAPI = (
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
});

export default authAPI;
