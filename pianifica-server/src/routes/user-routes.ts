import { Router } from "express";
import {
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/user/controller";
import { authenticationMiddleware } from "../middlewares/authentication";

const router = Router();

router.get("/", getUsers);
router.post("/:id", authenticationMiddleware, updateUser);
router.delete("/:id", authenticationMiddleware, deleteUser);

export default router;
