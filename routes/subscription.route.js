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
// Upcoming renewals for the authenticated user
subscriptionRouter.get("/upcoming-renewals", authMiddleware, upcomingRenewals);
// Get all subscriptions for a user
subscriptionRouter.get("/user/:id", authMiddleware, getSubscriptionsByUser);
// Get a single subscription by subscription ID
subscriptionRouter.get("/:id", authMiddleware, getSubscriptionById);

subscriptionRouter.put("/:id", authMiddleware, updateById);
subscriptionRouter.put("/cancel/:id", authMiddleware, cancelSubscription);

subscriptionRouter.delete("/:id", authMiddleware, deleteById);

export default subscriptionRouter;
