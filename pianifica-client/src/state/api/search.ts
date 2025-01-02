import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { Search } from "@/interface";

const searchAPI = (
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
  globalSearch: build.query<
    ApiResponse<Search>,
    { search?: string; limit?: number; page?: number }
  >({
    query: ({ search, limit = 2, page = 1 }) => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      return {
        url: `search?${params.toString()}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("accessToken")
            ? `Bearer ${sessionStorage.getItem("accessToken")}`
            : undefined,
        },
      };
    },
  }),
});

export default searchAPI;
