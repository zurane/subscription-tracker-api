import { Router } from "express";
import { findUsers, findUserById } from "../controllers/users.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", findUsers);

userRouter.get("/:id", authMiddleware, findUserById);

userRouter.post("/", (req, res) => {
  res.send({ message: "Create user" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ message: "Update user by ID" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ message: "Delete user by ID" });
});

export default userRouter;
