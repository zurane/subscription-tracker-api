import { Router } from "express";
import {
  findUsers,
  findUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/users.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", findUsers);
userRouter.get("/:id", authMiddleware, findUserById);
userRouter.put("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);

export default userRouter;
