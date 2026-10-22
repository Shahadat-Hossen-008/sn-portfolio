import { describe, expect, it } from "vitest";

import { validateContactSubmission } from "./contactValidation";

const validSubmission = {
  name: "Taylor",
  email: "taylor@example.com",
  subject: "Hello",
  message: "A message\nwith multiple lines.",
};

describe("validateContactSubmission", () => {
  it("trims and accepts valid contact details", () => {
    expect(
      validateContactSubmission({
        name: " Taylor ",
        email: " taylor@example.com ",
        subject: " Hello ",
        message: " A message ",
      }),
    ).toEqual({
      name: "Taylor",
      email: "taylor@example.com",
      subject: "Hello",
      message: "A message",
    });
  });

  it.each([
    null,
    [],
    { ...validSubmission, name: 1 },
    { ...validSubmission, email: "not an email" },
    { ...validSubmission, email: `victim@example.com\r\nBcc: bad@example.com` },
    { ...validSubmission, subject: "Hello\r\nBcc: bad@example.com" },
    { ...validSubmission, name: " ".repeat(101) },
    { ...validSubmission, subject: "s".repeat(151) },
    { ...validSubmission, message: "m".repeat(5001) },
    { ...validSubmission, message: "not empty\0hidden" },
  ])("rejects invalid contact payload %#", (value) => {
    expect(validateContactSubmission(value)).toBeNull();
  });
});
