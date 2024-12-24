import type { Priority, Status } from "@prisma/client";

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export interface Filter {
  search: string;
  page: number;
  limit: number;
  sortBy: string;
  order: Order;
  priority?: string | null;
  status?: string | null;
}

const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const DEFAULT_ORDER = Order.ASC;

const SORT_BY_DEFAULT = ["createdAt", "updatedAt"];
const SORT_BY_USERS = [
  "createdAt",
  "updatedAt",
  "username",
  "email",
  "firstName",
  "lastName",
];
const SORT_BY_TEAMS = ["createdAt", "updatedAt", "name"];
const SORT_BY_PROJECTS = ["createdAt", "updatedAt", "name"];
const SORT_BY_TASKS = [
  "createdAt",
  "updatedAt",
  "title",
  "status",
  "priority",
  "points",
  "startDate",
  "dueDate",
];
function getAllowedSortBy(sortFor?: string | null): string[] {
  if (sortFor === "users") {
    return SORT_BY_USERS;
  }
  if (sortFor === "teams") {
    return SORT_BY_TEAMS;
  }
  if (sortFor === "projects") {
    return SORT_BY_PROJECTS;
  }
  if (sortFor === "tasks") {
    return SORT_BY_TASKS;
  }
  return SORT_BY_DEFAULT;
}
function getValidateSortBy(
  sortFor: string,
  sortBy?: string | null | undefined
): string {
  if (!sortBy) return DEFAULT_SORT_BY;
  if (getAllowedSortBy(sortFor).includes(sortBy)) return sortBy;
  return DEFAULT_SORT_BY;
}

export const getFilters = (
  filter: {
    search?: string | null | undefined;
    page?: number | null | undefined;
    limit?: number | null | undefined;
    sortBy?: string | null | undefined;
    order?: Order | null | undefined;
    priority?: string | null | undefined;
    status?: string | null | undefined;
  },
  sortFor: string
): Filter => {
  const filters: Filter = {
    search: filter?.search || "",
    page: filter?.page || DEFAULT_PAGE,
    limit: filter?.limit || DEFAULT_LIMIT,
    sortBy: getValidateSortBy(sortFor, filter.sortBy),
    order: filter?.order || DEFAULT_ORDER,
  };

  if (sortFor === "tasks") {
    filters.priority = filter?.priority || null;
    filters.status = filter?.status || null;
  }

  return filters;
};
