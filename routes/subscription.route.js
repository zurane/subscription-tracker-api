import { Router } from "express";
import {
  getAllSubscriptions,
  createSubscription,
  getSubscriptionById,
  getSubscriptionsByUser,
  updateById,
  deleteById,
  cancelSubscription,
  upcomingRenewals,
} from "../controllers/subscription.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authMiddleware, createSubscription);
subscriptionRouter.get("/", authMiddleware, getAllSubscriptions);

// More specific routes BEFORE generic /:id routes
subscriptionRouter.get("/upcoming-renewals", authMiddleware, upcomingRenewals);
subscriptionRouter.get("/user/:id", authMiddleware, getSubscriptionsByUser);
subscriptionRouter.put("/cancel/:id", authMiddleware, cancelSubscription);

// Generic routes LAST
subscriptionRouter.get("/:id", authMiddleware, getSubscriptionById);
subscriptionRouter.put("/:id", authMiddleware, updateById);
subscriptionRouter.delete("/:id", authMiddleware, deleteById);

export default subscriptionRouter;
