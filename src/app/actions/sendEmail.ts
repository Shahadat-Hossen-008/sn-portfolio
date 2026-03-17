"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import EmailContainer from "@/emails/EmailContainer";
import { FormSubmitData } from "@/app/types/formType";

export async function sendMail(formData: FormSubmitData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 20,
    });

    const emailHtml = await render(
      EmailContainer({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    );

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_RECIEVER_ADDRESS,
      subject: formData.subject,
      text: formData.message,
      html: emailHtml,
      replyTo: formData.email,
    });

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to send email" };
  }
}
