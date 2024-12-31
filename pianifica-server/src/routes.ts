import { Router } from "express";
import { authenticationMiddleware } from "./middlewares/authentication";
import { superAdminAuthenticationMiddleware } from "./middlewares/super-admin-authentication";
import {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  getUserOrganization,
  getUserTasks,
} from "./controllers/user/controller";
import {
  addTeamMember,
  getTeamMembers,
  getTeams,
  getTeam,
  removeTeamMember,
  addTeam,
  updateTeam,
  deleteTeam,
} from "./controllers/team/controller";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  getProjectTasks,
  updateProject,
} from "./controllers/project/controller";
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
} from "./controllers/organization/controller";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  addCommentToTask,
  updateTaskAssignee,
  updateTaskPriority,
  updateTaskStatus,
} from "./controllers/task/controller";
import { loginUser, registerNewUser } from "./controllers/auth/controller";
import { globalSearch, search } from "./controllers/search/controller";

const router = Router();

// Auth routes
router.post("/auth/login", loginUser);
router.post("/auth/register", registerNewUser);

//Organization routes
router.get(
  "/organizations",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  getOrganizations
);
router.get(
  "/organization/:id",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  getOrganization
);
router.post(
  "/organization",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  createOrganization
);
router.put(
  "/organization",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  updateOrganization
);
router.delete(
  "/organization/:id",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  deleteOrganization
);

// Project routes
router.get("/projects", authenticationMiddleware, getProjects);
router.get("/project/:id", authenticationMiddleware, getProject);
router.get("/project/:id/tasks", authenticationMiddleware, getProjectTasks);
router.post("/project", authenticationMiddleware, createProject);
router.put("/project", authenticationMiddleware, updateProject);
router.delete("/project/:projectId", authenticationMiddleware, deleteProject);

// Task routes
router.get("/tasks", authenticationMiddleware, getTasks);
router.get("/task/:id", authenticationMiddleware, getTask);
router.post("/task", authenticationMiddleware, createTask);
router.put("/task", authenticationMiddleware, updateTask);
router.post("/task/:id/comment", authenticationMiddleware, addCommentToTask);
router.patch("/task/:id/status", authenticationMiddleware, updateTaskStatus);
router.patch(
  "/task/:id/priority",
  authenticationMiddleware,
  updateTaskPriority
);
router.patch(
  "/task/:id/assignedUser",
  authenticationMiddleware,
  updateTaskAssignee
);
router.delete("/task/:id", authenticationMiddleware, deleteTask);

// Team routes
router.get("/teams", authenticationMiddleware, getTeams);
router.post("/team", authenticationMiddleware, addTeam);
router.put("/team", authenticationMiddleware, updateTeam);
router.delete("/team/:id", authenticationMiddleware, deleteTeam);
router.get("/team/:id", authenticationMiddleware, getTeam);
router.get("/team/:id/members", authenticationMiddleware, getTeamMembers);
router.post("/team/:id/member", authenticationMiddleware, addTeamMember);
router.delete("/team/:id/member", authenticationMiddleware, removeTeamMember);

// User routes
router.get("/users", authenticationMiddleware, getUsers);
router.get("/user", authenticationMiddleware, getCurrentUser);
router.get("/user/organization", authenticationMiddleware, getUserOrganization);
router.get("/user/tasks", authenticationMiddleware, getUserTasks);
router.get("/user/:username", authenticationMiddleware, getUser);
router.post("/user/:id", authenticationMiddleware, updateUser);
router.delete("/user/:id", authenticationMiddleware, deleteUser);

// Search routes
router.use("/search", authenticationMiddleware, globalSearch);

export default router;
