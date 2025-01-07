import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

import authAPI from "./api/auth";
import projectAPI from "./api/project";
import searchAPI from "./api/search";
import tagAPI from "./api/tag";
import taskAPI from "./api/task";
import teamAPI from "./api/team";
import userAPI from "./api/user";
import notificationAPI from "./api/notification";

export type ApiResponse<T> = {
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
    "Users",
    "User",
    "Projects",
    "Project",
    "Teams",
    "Team",
    "Tasks",
    "Task",
    "UserTasks",
    "Notifications",
    "Tags",
  ],
  endpoints: (build) => ({
    ...authAPI(build),
    ...projectAPI(build),
    ...taskAPI(build),
    ...teamAPI(build),
    ...userAPI(build),
    ...tagAPI(build),
    ...searchAPI(build),
    ...notificationAPI(build),
  }),
});

export const {
  // Auth
  useLoginUserMutation,
  useRegisterUserMutation,
  // User
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useGetUserOrganizationQuery,
  useGetUserTasksQuery,
  useGetUserNotificationsQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Project
  useGetProjectsQuery,
  useGetBookmarkedProjectsQuery,
  useGetProjectQuery,
  useAddBookmarkProjectMutation,
  useRemoveBookmarkProjectMutation,
  useGetProjectTasksQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  // Task
  useGetTasksQuery,
  useGetBookmarkedTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useCreateCommentMutation,
  useAddBookmarkTaskMutation,
  useRemoveBookmarkTaskMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskPriorityMutation,
  useUpdateTaskAssigneeMutation,
  useDeleteTaskMutation,
  // Team
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useRemoveTeamMutation,
  useGetTeamQuery,
  useGetTeamProjectsQuery,
  useAddTeamProjectMutation,
  useRemoveTeamProjectMutation,
  useGetTeamMemberQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  // Tag
  useGetTagsQuery,
  useCreateTagMutation,
  useCreateTagsMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  //Notification
  useMarkAsSeenMutation,
  useMarkAllAsSeenMutation,
  // Search
  useGlobalSearchQuery,
} = api;
