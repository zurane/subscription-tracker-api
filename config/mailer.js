import nodemailer from "nodemailer";
import { USER_SMTP_PASS } from "./env.js";

export const accountMail = "giftedmpho99@gmail.com";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: accountMail,
        pass: USER_SMTP_PASS,
    },
});

export default transporter;
