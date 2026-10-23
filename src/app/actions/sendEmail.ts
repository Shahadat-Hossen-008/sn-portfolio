"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { EmailContainer } from "@/emails";
import { validateContactSubmission } from "./contactValidation";

let transporter: nodemailer.Transporter | undefined;

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value || /[\r\n\0]/.test(value)) {
    throw new Error(`Missing or invalid environment variable: ${name}`);
  }
  return value;
}

function getTransporter(user: string, password: string): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: password },
      pool: true,
      maxConnections: 1,
      maxMessages: 20,
    });
  }

  return transporter;
}

function getSafeErrorCode(error: unknown): string {
  if (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return error instanceof Error ? error.name : "UnknownError";
}

export async function sendMail(formData: unknown) {
  const validated = validateContactSubmission(formData);
  if (!validated) {
    return { success: false, error: "Please enter valid contact details." };
  }

  try {
    const user = requiredEnvironmentValue("SMTP_USER");
    const password = requiredEnvironmentValue("SMTP_PASSWORD");
    const recipient = requiredEnvironmentValue("MAIL_RECIEVER_ADDRESS");
    const mailer = getTransporter(user, password);

    const emailHtml = await render(
      EmailContainer({
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
      }),
    );

    await mailer.sendMail({
      from: `"Website Contact" <${user}>`,
      to: recipient,
      subject: `Contact form: ${validated.subject}`,
      text: validated.message,
      html: emailHtml,
      replyTo: validated.email,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Contact form email delivery failed", {
      code: getSafeErrorCode(error),
    });
    return { success: false, error: "Failed to send email" };
  }
}
