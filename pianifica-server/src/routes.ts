import { Router } from "express";
import projectRoutes from "./routes/project-routes";
import taskRoutes from "./routes/task-routes";
import userRoutes from "./routes/user-routes";
import searchRoutes from "./routes/search-routes";

const router = Router();

router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use("/users", userRoutes);
router.use("/search", searchRoutes);

export default router;
