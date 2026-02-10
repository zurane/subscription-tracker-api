import { Resend } from 'resend';
import { USER_SMTP_PASS } from "./env.js";

// Initialize the Resend client once
export const resend = new Resend(USER_SMTP_PASS);