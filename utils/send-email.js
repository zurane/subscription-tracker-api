import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import { resend } from "../config/mailer.js";



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

    // Send via Resend SDK
    const response = await resend.emails.send({
        from: 'Subscription Tracker <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: message,

    })

    if (response.error) {
        console.error("Resend API Error:", response.error);
        throw new Error(`Failed to send email: ${response.error.message}`);
    }

    return response;
};

export default sendEmailReminder;
