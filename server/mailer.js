import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

export const mailConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = mailConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

export async function sendMail({ to, subject, text }) {
  if (!mailConfigured || !to) {
    console.log(`[mail] not configured — skipping "${subject}" to ${to || "(no address)"}`);
    return false;
  }
  try {
    await transporter.sendMail({ from: MAIL_FROM || SMTP_USER, to, subject, text });
    return true;
  } catch (e) {
    console.error("[mail] send failed:", e.message);
    return false;
  }
}
