"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.example.com',
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        from: `"Job Board" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
    });
}
//# sourceMappingURL=mailer.js.map