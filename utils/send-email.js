import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter from "../config/mailer.js";
import { ADMIN_EMAIL } from "../config/env.js";

const sendEmailReminder = async ({ to, type, subscription }) => {
  //check if there it to and type value otherwise throw an error

  if (!to || !type) {
    throw new Error("missing required parameters");
  }
  const template = emailTemplates.find((t) => t.label === type);

  if (!template) {
    throw new Error("No template found");
  }

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MM/DD/YYYY"),
    price: `${subscription.currency} ${subscription.price}`,
    frequency: subscription.subscriptionFrequency,
    status: subscription.status,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: ADMIN_EMAIL,
    to: to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    res.status(200).json({ message: info.response });
  });
};

export default sendEmailReminder;
