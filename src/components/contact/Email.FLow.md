# Email Flow (Contact Form)

## Overview

When a user wants to contact us or share an idea, they submit the contact form.  
After submission, our server sends an email to our inbox using **Gmail SMTP** via **Nodemailer**.

The user’s email address is set as `Reply-To` so we can reply directly to the user from our inbox.

## High-level flow

1. User fills out the form: `name`, `email`, `subject`, `message`
2. The client submits the data to the server action: `sendMail(formData)`
3. The server validates required environment variables and input
4. The server renders the email HTML template using `@react-email/render`
5. The server sends the email using Nodemailer + Gmail SMTP
6. The server returns `{ success: true }` or `{ success: false }` to the UI

## SMTP + headers behavior (important)

We send email using Gmail SMTP (`service: "gmail"`). Because Gmail prevents email spoofing, we **do not** set the user’s email address as the `from` address.

### Correct fields

- **from**: our authenticated Gmail sender (the SMTP account we log in with)
- **to**: our inbox (the receiver)
- **replyTo**: the user’s email address from the form

This typically results in Gmail showing:

- `From: our-sender@gmail.com`
- `Reply-To: user@gmail.com`
- `To: our-inbox@gmail.com`

### Why `from !== replyTo`

- `From` is the sender identity. With Gmail SMTP, this is usually restricted to the authenticated account (or verified aliases) to prevent impersonation.
- `Reply-To` controls where the email client sends the response when clicking **Reply**.

## Environment variables

The following variables must be set:

- `SMTP_USER`  
  Gmail address used to authenticate SMTP (example: `our-sender@gmail.com`)

- `SMTP_PASSWORD`  
  A **Google App Password** (recommended). This is **not** your normal Gmail password.

- `MAIL_RECIEVER_ADDRESS`  
  Inbox that receives contact form submissions (example: `our-inbox@gmail.com`)

> Note: The variable name is spelled `MAIL_RECIEVER_ADDRESS`. Make sure your `.env` key matches this exact spelling, otherwise `to` becomes undefined and Nodemailer may throw `EENVELOPE: No recipients defined`.

## Recommended `sendMail` configuration

- Collect user information from the contact form.
- Create a server-side email action (Nodemailer must run on the server).
- Create a Nodemailer transporter using Gmail credentials.
- Render the React Email template to an HTML string using `@react-email/render`.
- Send the email using `transporter.sendMail`.

```ts
await transporter.sendMail({
  from: `"Website Contact" <${process.env.SMTP_USER}>`,
  to: process.env.MAIL_RECIEVER_ADDRESS,
  subject: `From ${formData.name} <${formData.email}>: ${formData.subject}`,
  text: formData.message,
  html: emailHtml,
  replyTo: `"${formData.name}" <${formData.email}>`,
});
```
