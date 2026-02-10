import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { USER_SMTP_PASS } from "../config/env.js";

// 1. Initialize Brevo Client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = USER_SMTP_PASS;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmailReminder = async ({ to, type, subscription }) => {
    // Safety Check: Ensure Key is loaded
    if (!USER_SMTP_PASS || !USER_SMTP_PASS.startsWith('xkeysib-')) {
        throw new Error("Invalid API Key: USER_SMTP_PASS must start with 'xkeysib-'");
    }

    // 2. Validation
    if (!to || !type) {
        throw new Error("Missing required parameters: 'to' or 'type'");
    }

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) {
        throw new Error(`No template found for type: ${type}`);
    }

    // 3. Data Preparation
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

    // 4. Send Email (Using Plain Object Structure)
    const sendSmtpEmail = {
        sender: {
            name: "Mpho Lebona",
            email: "giftedmpho99@gmail.com", // Verified Sender
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: message,
    };

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
