import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import SibApiV3Sdk from "sib-api-v3-sdk"; // Standard package name
import { USER_SMTP_PASS } from "../config/env.js"; // This should be your Brevo API Key (xkeysib-...)

// Initialize Brevo Client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = USER_SMTP_PASS;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmailReminder = async ({ to, type, subscription }) => {
    // 1. Validation
    if (!to || !type) {
        throw new Error("Missing required parameters: 'to' or 'type'");
    }

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) {
        throw new Error(`No template found for type: ${type}`);
    }

    // Data Preparation
    const mailInfo = {
        userName: subscription.user ? subscription.user.name : "Subscriber",
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
        price: `${subscription.currency} ${subscription.price}`,
        frequency: subscription.frequency,
        status: subscription.status,
        paymentMethod: subscription.paymentMethod,
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    // 3. Configure Email Object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = message;
    sendSmtpEmail.sender = {
        name: "Subscription Tracker",
        email: "giftedmpho99@gmail.com", // MUST be verified in Brevo dashboard
    };
    sendSmtpEmail.to = [{ email: to }]; // Dynamic recipient

    // 4. Send Email
    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email sent successfully to ${to}. Message ID: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error("Brevo Email Error:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmailReminder;