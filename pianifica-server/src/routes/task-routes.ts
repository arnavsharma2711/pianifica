import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/task/controller";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/status", updateTaskStatus);

export default router;
