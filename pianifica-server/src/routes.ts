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
  updateUserPassword,
  getUserNotifications,
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
  getTeamProjects,
  addTeamProject,
  removeTeamProject,
} from "./controllers/team/controller";
import {
  bookmarkProject,
  createProject,
  deleteProject,
  getBookmarkProjects,
  getProject,
  getProjects,
  getProjectTasks,
  removeBookmarkProject,
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
  bookmarkTask,
  removeBookmarkTask,
  getBookmarkTasks,
} from "./controllers/task/controller";
import {
  forgotPassword,
  loginUser,
  registerNewUser,
  verifyForgotPassword,
} from "./controllers/auth/controller";
import { globalSearch } from "./controllers/search/controller";
import {
  createTag,
  createTags,
  deleteTag,
  getTags,
  updateTag,
} from "./controllers/tags/controller";
import {
  createMailer,
  deleteMailer,
  getMailer,
  getMailers,
  previewMailer,
  updateMailer,
} from "./controllers/mailer/controller";
import {
  markAllAsSeenNotification,
  markAsSeenNotification,
} from "./controllers/notification/controller";

const router = Router();

// Auth routes
router.post("/auth/login", loginUser);
router.post("/auth/register", registerNewUser);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verify-forgot-password", verifyForgotPassword);

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

// Mailer routes
router.get(
  "/mailers",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  getMailers
);
router.get(
  "/mailer/:id",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  getMailer
);
router.post(
  "/mailer",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  createMailer
);
router.put(
  "/mailer",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  updateMailer
);
router.delete(
  "/mailer/:id",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  deleteMailer
);
router.post(
  "/mailer/:id/preview",
  authenticationMiddleware,
  superAdminAuthenticationMiddleware,
  previewMailer
);

// Project routes
router.get("/projects", authenticationMiddleware, getProjects);
router.get("/projects/bookmark", authenticationMiddleware, getBookmarkProjects);
router.get("/project/:id", authenticationMiddleware, getProject);
router.post("/project/:id/bookmark", authenticationMiddleware, bookmarkProject);
router.delete(
  "/project/:id/bookmark",
  authenticationMiddleware,
  removeBookmarkProject
);
router.get("/project/:id/tasks", authenticationMiddleware, getProjectTasks);
router.post("/project", authenticationMiddleware, createProject);
router.put("/project", authenticationMiddleware, updateProject);
router.delete("/project/:projectId", authenticationMiddleware, deleteProject);

// Task routes
router.get("/tasks", authenticationMiddleware, getTasks);
router.get("/tasks/bookmark", authenticationMiddleware, getBookmarkTasks);
router.get("/task/:id", authenticationMiddleware, getTask);
router.post("/task", authenticationMiddleware, createTask);
router.put("/task", authenticationMiddleware, updateTask);
router.post("/task/:id/comment", authenticationMiddleware, addCommentToTask);
router.post("/task/:id/bookmark", authenticationMiddleware, bookmarkTask);
router.delete(
  "/task/:id/bookmark",
  authenticationMiddleware,
  removeBookmarkTask
);
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
router.get("/team/:id/projects", authenticationMiddleware, getTeamProjects);
router.post(
  "/team/:id/project/:projectId",
  authenticationMiddleware,
  addTeamProject
);
router.delete(
  "/team/:id/project/:projectId",
  authenticationMiddleware,
  removeTeamProject
);
router.get("/team/:id/members", authenticationMiddleware, getTeamMembers);
router.post("/team/:id/member", authenticationMiddleware, addTeamMember);
router.delete("/team/:id/member", authenticationMiddleware, removeTeamMember);

// User routes
router.get("/users", authenticationMiddleware, getUsers);
router.get("/user", authenticationMiddleware, getCurrentUser);
router.get("/user/organization", authenticationMiddleware, getUserOrganization);
router.get("/user/tasks", authenticationMiddleware, getUserTasks);
router.get(
  "/user/notifications",
  authenticationMiddleware,
  getUserNotifications
);
router.get("/user/:username", authenticationMiddleware, getUser);
router.post("/user/:id", authenticationMiddleware, updateUser);
router.patch(
  "/user/update-password",
  authenticationMiddleware,
  updateUserPassword
);
router.delete("/user/:id", authenticationMiddleware, deleteUser);

// Tag routes
router.get("/tags", authenticationMiddleware, getTags);
router.post("/tag", authenticationMiddleware, createTag);
router.post("/tags", authenticationMiddleware, createTags);
router.put("/tag/:id", authenticationMiddleware, updateTag);
router.delete("/tag/:id", authenticationMiddleware, deleteTag);

// Notification routes
router.patch(
  "/notifications",
  authenticationMiddleware,
  markAllAsSeenNotification
);
router.patch(
  "/notification/:id",
  authenticationMiddleware,
  markAsSeenNotification
);

// Search routes
router.use("/search", authenticationMiddleware, globalSearch);

export default router;
