import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";

const notificationAPI = (
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
  markAsSeen: build.mutation<ApiResponse<null>, { id: number }>({
    query: ({ id }) => ({
      url: `notification/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "PATCH",
    }),
    invalidatesTags: ["Notifications"],
  }),
  markAllAsSeen: build.mutation<ApiResponse<null>, void>({
    query: () => ({
      url: "notifications",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "PATCH",
    }),
    invalidatesTags: ["Notifications"],
  }),
});

export default notificationAPI;
