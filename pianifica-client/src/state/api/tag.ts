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
      method: "GET",
    }),
    providesTags: ["Tags"],
  }),
  createTag: build.mutation<ApiResponse<Tag>, { name: string }>({
    query: ({ name }) => ({
      url: "tag",
      method: "POST",
      body: { name },
    }),
    invalidatesTags: ["Tags"],
  }),
  createTags: build.mutation<ApiResponse<Tag>, { name: string }>({
    query: ({ name }) => ({
      url: "tags",
      method: "POST",
      body: { name },
    }),
    invalidatesTags: ["Tags"],
  }),
  updateTag: build.mutation<ApiResponse<Tag>, { id: number }>({
    query: ({ id }) => ({
      url: `tag/${id}`,
      method: "PUT",
    }),
    invalidatesTags: ["Tags"],
  }),
  deleteTag: build.mutation<ApiResponse<null>, { name: string }>({
    query: ({ name }) => ({
      url: `tag/${name}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Tags"],
  }),
});

export default tagAPI;
