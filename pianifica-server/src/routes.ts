import { Router } from "express";
import projectRoutes from "./routes/project-routes";
import taskRoutes from "./routes/task-routes";

const router = Router();

router.use("/project", projectRoutes);

export default router;
