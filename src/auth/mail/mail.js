import nodemailer from "nodemailer";

function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email server environment variables are missing");
  }

  const port = Number(EMAIL_PORT);
  const secure =
    process.env.EMAIL_SECURE != null
      ? process.env.EMAIL_SECURE === "true"
      : port === 465;

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

export default async function sendOtpMail({ email, name, otp, purpose }) {
  const transporter = createTransporter();
  const appName = "Smart Study Planner";
  const preview = purpose === "verify" ? "Verify your account" : "Confirm your identity";

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SENDER_EMAIL || process.env.EMAIL_USER,
      to: email,
      subject: `${preview} - ${appName}`,
      text: `Hello ${name}, your ${appName} OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; padding: 24px; color: #171722;">
          <h2 style="margin: 0 0 8px;">${appName}</h2>
          <p style="margin: 0 0 20px;">Hello ${name}, use this one-time passcode to continue.</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 0.2em; margin: 0 0 16px;">
            ${otp}
          </div>
          <p style="margin: 0; color: #5d5b6f;">This code expires in 10 minutes.</p>
        </div>
      `,
    });
  } catch (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}
