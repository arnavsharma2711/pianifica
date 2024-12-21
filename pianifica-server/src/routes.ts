import { Router } from "express";
import authRoutes from "./routes/auth-routes";
import projectRoutes from "./routes/project-routes";
import taskRoutes from "./routes/task-routes";
import teamRoutes from "./routes/team-routes";
import userRoutes from "./routes/user-routes";
import searchRoutes from "./routes/search-routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use("/teams", teamRoutes);
router.use("/users", userRoutes);
router.use("/search", searchRoutes);

export default router;
