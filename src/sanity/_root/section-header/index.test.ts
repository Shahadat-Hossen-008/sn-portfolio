import { describe, expect, it, vi } from "vitest";

import { sectionHeaderFields } from "./index";

const createMockRule = () => {
  const calls: Array<{ name: string; args: unknown[] }> = [];
  const rule: Record<string, unknown> = {
    max: vi.fn((n: number) => {
      calls.push({ name: "max", args: [n] });
      return rule;
    }),
    required: vi.fn(() => {
      calls.push({ name: "required", args: [] });
      return rule;
    }),
    custom: vi.fn((fn: unknown) => {
      calls.push({ name: "custom", args: [fn] });
      return rule;
    }),
  };
  return { rule, calls };
};

type ValidationFn = (rule: unknown) => unknown;

describe("sectionHeaderFields", () => {
  it("creates the four expected fields with default limits and descriptions", () => {
    const fields = sectionHeaderFields();
    const names = fields.map((f) => f.name);
    expect(names).toEqual(["eyebrow", "heading", "headingAccent", "intro"]);

    const eyebrow = fields.find((f) => f.name === "eyebrow");
    const heading = fields.find((f) => f.name === "heading");
    const intro = fields.find((f) => f.name === "intro");

    const eyebrowRule = createMockRule();
    (eyebrow?.validation as ValidationFn | undefined)?.(eyebrowRule.rule);
    expect(eyebrowRule.rule.max).toHaveBeenCalledWith(40);

    const headingRule = createMockRule();
    (heading?.validation as ValidationFn | undefined)?.(headingRule.rule);
    expect(headingRule.rule.required).toHaveBeenCalled();
    expect(headingRule.rule.max).toHaveBeenCalledWith(70);
    expect(heading?.description).toContain("Max 70 characters.");

    const introRule = createMockRule();
    (intro?.validation as ValidationFn | undefined)?.(introRule.rule);
    expect(introRule.rule.max).toHaveBeenCalledWith(160);
    expect(intro?.description).toContain("Max 160 characters.");
  });

  it("applies option overrides to limits and descriptions", () => {
    const fields = sectionHeaderFields({
      headingMax: 50,
      introMax: 120,
      headingDescription: "Custom heading description",
      introDescription: "Custom intro description",
    });

    const heading = fields.find((f) => f.name === "heading");
    const intro = fields.find((f) => f.name === "intro");

    const headingRule = createMockRule();
    (heading?.validation as ValidationFn | undefined)?.(headingRule.rule);
    expect(headingRule.rule.max).toHaveBeenCalledWith(50);
    expect(heading?.description).toBe("Custom heading description");

    const introRule = createMockRule();
    (intro?.validation as ValidationFn | undefined)?.(introRule.rule);
    expect(introRule.rule.max).toHaveBeenCalledWith(120);
    expect(intro?.description).toBe("Custom intro description");
  });

  it("validates headingAccent matching case and handles empty values", () => {
    const fields = sectionHeaderFields();
    const headingAccent = fields.find((f) => f.name === "headingAccent");

    let customValidator: ((value: unknown, context: unknown) => true | string) | undefined;
    const accentRule = {
      custom: vi.fn((fn: (value: unknown, context: unknown) => true | string) => {
        customValidator = fn;
        return accentRule;
      }),
    };

    (headingAccent?.validation as ValidationFn | undefined)?.(accentRule);
    expect(customValidator).toBeDefined();

    const parent = { heading: "Thoughtful teams, useful products." };
    const context = { parent };

    // Passing cases: empty / whitespace / non-string
    expect(customValidator!(undefined, context)).toBe(true);
    expect(customValidator!("", context)).toBe(true);
    expect(customValidator!("   ", context)).toBe(true);

    // Passing case: matches exact substring and case
    expect(customValidator!("useful products.", context)).toBe(true);
    expect(customValidator!("Thoughtful", context)).toBe(true);

    // Failing cases: case mismatch or not in heading
    expect(customValidator!("Useful products.", context)).toBe(
      "Heading accent must appear in the heading with matching case.",
    );
    expect(customValidator!("nonexistent phrase", context)).toBe(
      "Heading accent must appear in the heading with matching case.",
    );
  });
});
