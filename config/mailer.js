import nodemailer from "nodemailer";
import { USER_SMTP_PASS, ADMIN_EMAIL } from "./env.js";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: ADMIN_EMAIL, // Avoid explicitly declaring the email in the codebase.
        pass: USER_SMTP_PASS,
    },
    logger: true, // Log information to console
    debug: true, // Include SMTP traffic in the logs
    family: 4
});

export default transporter;
