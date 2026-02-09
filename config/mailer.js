import nodemailer from "nodemailer";
import { USER_SMTP_PASS, ADMIN_EMAIL } from "./env.js";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: ADMIN_EMAIL, // Avoid explicity declaring the email in the codebase 
        pass: USER_SMTP_PASS,
    },
});

export default transporter;
