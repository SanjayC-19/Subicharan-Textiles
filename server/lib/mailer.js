import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Gmail SMTP transporter — uses the Gmail App Password from server/.env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // sanjaycs1902@gmail.com
    pass: process.env.EMAIL_PASS,  // Gmail App Password (spaces are fine)
  },
});

// Verify connection on startup (non-fatal)
transporter.verify((error) => {
  if (error) {
    console.error('[Mailer] Gmail SMTP connection failed:', error.message);
  } else {
    console.log('[Mailer] ✅ Gmail SMTP ready — sending from:', process.env.EMAIL_USER);
  }
});

export default transporter;
