import { createRequire } from "module";
import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";
import sendEmailReminder from "../utils/send-email.js";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  //Get request payload (data)
  const payload = context.requestPayload;

  // check if payload contains subscription ID otherwise exit workflow
  if (!payload?.subscriptionId) {
    console.log("Missing subscriptionId. Exiting workflow.");
    return;
  }

  //destructure subscription id from payload data
  const { subscriptionId } = payload;

  // wait for the helper function to query the database for the subscription
  const subscription = await fetchSubscription(context, subscriptionId);

  //check if the theres a subscription with that ID and if is not inactive
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  //check if the renewal date is not due yet, otherwise exit the workflow
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Date has passed for subscription: ${subscriptionId}. Exiting workflow`,
    );
    return;
  }

  //
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      await sendReminderUntil(
        context,
        `${daysBefore} days before reminder`,
        reminderDate,
      );
    }
    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerSend(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

// Helper functions
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sendReminderUntil = async (context, label, date) => {
  console.log(`Sleep until ${label} sending a reminder on ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerSend = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Trigger ${label}`);
    await sendEmailReminder({
      to: subscription.user.email,
      type: label,
      subscription
    });
  });
};
