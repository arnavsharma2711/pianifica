import { Router } from "express";
import authRoutes from "./routes/auth-routes";
import projectRoutes from "./routes/project-routes";
import taskRoutes from "./routes/task-routes";
import searchRoutes from "./routes/search-routes";
import { authenticationMiddleware } from "./middlewares/authentication";
import {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  deleteUser,
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

const router = Router();

router.use("/auth", authRoutes);
router.use("/project", authenticationMiddleware, projectRoutes);
router.use("/task", authenticationMiddleware, taskRoutes);

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
router.get("/user/:username", authenticationMiddleware, getUser);
router.post("/user/:id", authenticationMiddleware, updateUser);
router.delete("/user/:id", authenticationMiddleware, deleteUser);

router.use("/search", authenticationMiddleware, searchRoutes);

export default router;
