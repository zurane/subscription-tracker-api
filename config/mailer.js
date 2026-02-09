import nodemailer from "nodemailer";
import { USER_SMTP_PASS } from "./env.js";

export const accountMail = "giftedmpho99@gmail.com";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: accountMail,
        pass: USER_SMTP_PASS,
    },
});

export default transporter;
