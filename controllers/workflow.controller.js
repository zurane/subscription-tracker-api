import { createRequire } from "module";
import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2];

export const sendReminders = serve(async (context) => {

  const payload = context.requestPayload;

  if (!payload?.subscriptionId) {

    console.log("Missing subscriptionId. Exiting workflow.");
    return;
  }

  const { subscriptionId } = payload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Date has passed for subscription: ${subscriptionId}. Exiting workflow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      await sendReminderUntil(
        context,
        `Remaining ${daysBefore} days before`,
        reminderDate,
      );
    }
    await triggerSend(context, `${daysBefore} days before`);
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

const triggerSend = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Trigger ${label}`);
    //send something
  });
};
