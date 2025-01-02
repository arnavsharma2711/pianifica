import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../api";
import type { Tag } from "@/interface";

const tagAPI = (
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
  getTags: build.query<ApiResponse<Tag[]>, void>({
    query: () => ({
      url: "tags",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "GET",
    }),
    providesTags: ["Tags"],
  }),
  createTag: build.mutation<ApiResponse<Tag>, { name: string }>({
    query: ({ name }) => ({
      url: "tag",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "POST",
      body: { name },
    }),
    invalidatesTags: ["Tags"],
  }),
  createTags: build.mutation<ApiResponse<Tag>, { name: string }>({
    query: ({ name }) => ({
      url: "tags",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "POST",
      body: { name },
    }),
    invalidatesTags: ["Tags"],
  }),
  updateTag: build.mutation<ApiResponse<Tag>, { id: number }>({
    query: ({ id }) => ({
      url: `tag/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "PUT",
    }),
    invalidatesTags: ["Tags"],
  }),
  deleteTag: build.mutation<ApiResponse<null>, { name: string }>({
    query: ({ name }) => ({
      url: `tag/${name}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("accessToken")
          ? `Bearer ${sessionStorage.getItem("accessToken")}`
          : undefined,
      },
      method: "DELETE",
    }),
    invalidatesTags: ["Tags"],
  }),
});

export default tagAPI;
