import type { FormSubmitData } from "@/sections/contact/sub-components/form/interface";

const EMAIL_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const HEADER_CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const MESSAGE_CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateContactSubmission(
  value: unknown,
): FormSubmitData | null {
  if (!isRecord(value)) return null;

  const { name, email, subject, message } = value;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return null;
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (
    cleanName.length === 0 ||
    cleanName.length > 100 ||
    HEADER_CONTROL_CHARACTERS.test(cleanName) ||
    cleanEmail.length > 254 ||
    HEADER_CONTROL_CHARACTERS.test(cleanEmail) ||
    !EMAIL_PATTERN.test(cleanEmail) ||
    cleanSubject.length === 0 ||
    cleanSubject.length > 150 ||
    HEADER_CONTROL_CHARACTERS.test(cleanSubject) ||
    cleanMessage.length === 0 ||
    cleanMessage.length > 5000 ||
    MESSAGE_CONTROL_CHARACTERS.test(cleanMessage)
  ) {
    return null;
  }

  return {
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
  };
}
