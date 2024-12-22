import { Router } from "express";
import authRoutes from "./routes/auth-routes";
import projectRoutes from "./routes/project-routes";
import taskRoutes from "./routes/task-routes";
import teamRoutes from "./routes/team-routes";
import searchRoutes from "./routes/search-routes";
import { authenticationMiddleware } from "./middlewares/authentication";
import {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  deleteUser,
} from "./controllers/user/controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/project", authenticationMiddleware, projectRoutes);
router.use("/task", authenticationMiddleware, taskRoutes);
router.use("/teams", authenticationMiddleware, teamRoutes);

// User routes
router.get("/users", authenticationMiddleware, getUsers);
router.get("/user", authenticationMiddleware, getCurrentUser);
router.get("/user/:username", authenticationMiddleware, getUser);
router.post("/user/:id", authenticationMiddleware, updateUser);
router.delete("/user/:id", authenticationMiddleware, deleteUser);

router.use("/search", authenticationMiddleware, searchRoutes);

export default router;
