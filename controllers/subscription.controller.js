import { SERVER } from "../config/env.js";
import workflowClient from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";


const createSubscription = async (req, res, next) => {
  try {
    // validate that req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in to create a subscription" });
    }

    // Create a new subscription associated with the authenticated user
    const userId = req.user._id || req.user.id;
    // Set default renewalDate if not provided
    const freqMap = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    // Check and set renewalDate if not provided.
    if (!req.body.renewalDate) {
      const renewalDate = new Date(req.body.startDate);
      renewalDate.setDate(
        renewalDate.getDate() + (freqMap[req.body.subscriptionFrequency] || 30),
      );
      req.body.renewalDate = renewalDate;
    }

    const subscription = await Subscription.create({
      ...req.body,
      user: userId,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER}/api/v1/workflows/subscriptions/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({
      message: "Subscription created successfully",
      success: true,
      data: { subscription, workflowRunId }
    });

    next();
  } catch (error) {
    console.error("createSubscription error:", error.stack || error);
  }
};
// Controller to get all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller to get a single subscription by subscription ID
const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    // Ensure authenticated user owns the subscription
    if (!subscription.user.equals(req.user._id)) {
      const error = new Error("You are not authorized to view this subscription");
      error.status = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get all subscriptions for a user
const getSubscriptionsByUser = async (req, res, next) => {
  try {
    // Only allow the authenticated user to fetch their own subscriptions
    if (!req.user._id.equals(req.params.id)) {
      const error = new Error("You are not authorized to view this user's subscriptions");
      error.status = 403;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("Subscription ID is required");
    }

    // Check subscription exists and user owns it
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (!subscription.user.equals(req.user._id)) {
      const error = new Error("You are not authorized to update this subscription");
      error.status = 403;
      throw error;
    }

    const updateSubscription = await Subscription.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      success: true,
      data: updateSubscription,
    });
    next();
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Check subscription exists and user owns it
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (!subscription.user.equals(req.user._id)) {
      const error = new Error("You are not authorized to delete this subscription");
      error.status = 403;
      throw error;
    }

    const deleteSubscription = await Subscription.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: deleteSubscription,
    });
    next();
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to cancel this subscription");
      error.status = 403;
      throw error;
    }

    const canceledSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "canceled" },
      { new: true, runValidators: true },
    );


    if (!canceledSubscription) {
      const error = new Error("Failed to cancel subscription; update returned null");
      error.status = 500;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: canceledSubscription,
    });
    next();
  } catch (error) {
    next(error);
  }
};

const upcomingRenewals = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    const renewals = await Subscription.find({
      user: userId,
      status: "active",
      renewalDate: { $gte: today }, //Get all documents whose renewalDate is greater than or equal to todays date
    });

    res.status(200).json({
      success: true,
      count: renewals.length,
      data: renewals.length === 0 ? 'No upcoming renewals' : renewals, //if no renewals, send a friendly message.
    });
  } catch (error) {
    next(error);
  }
};


export {
  getAllSubscriptions,
  createSubscription,
  getSubscriptionById,
  getSubscriptionsByUser,
  updateById,
  cancelSubscription,
  deleteById,
  upcomingRenewals,
};
