import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project/controller";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

export default router;
