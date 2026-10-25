import { describe, expect, it, vi } from "vitest";

import { pageSection } from "@/sanity/_root/sections";
import { aboutIntroSection } from "@/sanity/buildableSection/aboutIntroSection";
import { ctaSection } from "@/sanity/buildableSection/ctaSection";
import { experienceSection } from "@/sanity/buildableSection/experienceSection";
import { processSection } from "@/sanity/buildableSection/processSection";
import { quoteSection } from "@/sanity/buildableSection/quoteSection";
import { sections } from "@/sanity/schemaTypes";

type MockRule = {
  max: ReturnType<typeof vi.fn>;
  required: ReturnType<typeof vi.fn>;
  unique: ReturnType<typeof vi.fn>;
  custom: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
};

type ValidationFn = (rule: unknown) => unknown;

const createMockRule = (): MockRule => {
  const mockRule: MockRule = {
    max: vi.fn().mockReturnThis(),
    required: vi.fn().mockReturnThis(),
    unique: vi.fn().mockReturnThis(),
    custom: vi.fn().mockReturnThis(),
    error: vi.fn().mockReturnThis(),
  };
  return mockRule;
};

const captureCustomValidator = (validationFn: unknown) => {
  let validator: ((value: unknown, context: unknown) => true | string) | undefined;
  const mockRule = {
    ...createMockRule(),
    custom: vi.fn((fn: (value: unknown, context: unknown) => true | string) => {
      validator = fn;
      return mockRule;
    }),
  };
  (validationFn as ValidationFn | undefined)?.(mockRule);
  return validator;
};

describe("About-page section schemas", () => {
  const newSections = [
    aboutIntroSection,
    quoteSection,
    processSection,
    experienceSection,
    ctaSection,
  ];

  it("registers all five in sections as documents", () => {
    for (const section of newSections) {
      expect(section.type).toBe("document");
      expect(sections.some((s) => s.name === section.name)).toBe(true);
    }

    const sectionNames = sections.map((s) => s.name);
    const aboutBuilderIndex = sectionNames.indexOf("aboutBuilderSection");
    expect(aboutBuilderIndex).toBeGreaterThan(-1);

    expect(sectionNames.slice(aboutBuilderIndex + 1, aboutBuilderIndex + 6)).toEqual([
      "aboutIntroSection",
      "quoteSection",
      "processSection",
      "experienceSection",
      "ctaSection",
    ]);
  });

  it("registers each section as a reference member in pageSections", () => {
    const ofList = pageSection.of as Array<{ name?: string; type: string; to?: Array<{ type: string }> }>;
    for (const section of newSections) {
      const refMember = ofList.find((m) => m.name === section.name);
      expect(refMember).toBeDefined();
      expect(refMember?.type).toBe("reference");
      expect(refMember?.to).toEqual([{ type: section.name }]);
    }
  });

  it("places each section in exactly one insertMenu group with existing groups preserved", () => {
    const groups = pageSection.options?.insertMenu?.groups ?? [];
    const profileGroup = groups.find((g) => g.name === "profile");
    const sectionsGroup = groups.find((g) => g.name === "sections");

    expect(profileGroup).toBeDefined();
    expect(profileGroup?.title).toBe("About me");
    expect(profileGroup?.of).toEqual([
      "curiositySection",
      "aboutBuilderSection",
      "aboutIntroSection",
      "quoteSection",
      "processSection",
      "experienceSection",
    ]);

    expect(sectionsGroup).toBeDefined();
    expect(sectionsGroup?.title).toBe("Content");
    expect(sectionsGroup?.of).toEqual([
      "richTextSection",
      "technologyCarousel",
      "technologySection",
      "ctaSection",
    ]);

    for (const section of newSections) {
      const membershipCount = groups.filter((g) => g.of?.includes(section.name)).length;
      expect(membershipCount).toBe(1);
    }
  });

  it("has a non-empty description on every field and array-item field", () => {
    for (const section of newSections) {
      const topFields = section.fields as Array<{
        name: string;
        description?: string;
        type?: string;
        of?: Array<{ fields?: Array<{ name: string; description?: string }> }>;
      }>;

      for (const field of topFields) {
        expect(
          typeof field.description === "string" && field.description.trim().length > 0,
          `Expected non-empty description on ${section.name}.${field.name}`,
        ).toBe(true);

        if (field.type === "array" && Array.isArray(field.of)) {
          for (const member of field.of) {
            if (Array.isArray(member.fields)) {
              for (const subField of member.fields) {
                expect(
                  typeof subField.description === "string" && subField.description.trim().length > 0,
                  `Expected non-empty description on ${section.name}.${field.name}[item].${subField.name}`,
                ).toBe(true);
              }
            }
          }
        }
      }
    }
  });

  it("does not include an seo field on any of the five documents", () => {
    for (const section of newSections) {
      const fields = section.fields as Array<{ name: string }>;
      expect(fields.some((f) => f.name === "seo")).toBe(false);
    }
  });

  describe("aboutIntroSection", () => {
    it("enforces limits on heading, lead and body", () => {
      const headingField = aboutIntroSection.fields.find((f) => f.name === "heading");
      const introField = aboutIntroSection.fields.find((f) => f.name === "intro");
      const bodyField = aboutIntroSection.fields.find((f) => f.name === "body");

      const headingRule = createMockRule();
      (headingField?.validation as ValidationFn | undefined)?.(headingRule);
      expect(headingRule.required).toHaveBeenCalled();
      expect(headingRule.max).toHaveBeenCalledWith(60);

      const introRule = createMockRule();
      (introField?.validation as ValidationFn | undefined)?.(introRule);
      expect(introRule.max).toHaveBeenCalledWith(140);

      const bodyRule = createMockRule();
      (bodyField?.validation as ValidationFn | undefined)?.(bodyRule);
      expect(bodyRule.max).toHaveBeenCalledWith(220);
    });

    it("prepares preview safely with fallbacks", () => {
      const preview = aboutIntroSection.preview;
      expect(preview?.prepare?.({ title: "My heading", subtitle: "My eyebrow" })).toEqual({
        title: "My heading",
        subtitle: "My eyebrow",
      });
      expect(preview?.prepare?.({ title: undefined, subtitle: undefined })).toEqual({
        title: "About intro",
        subtitle: "About page opening",
      });
    });
  });

  describe("quoteSection", () => {
    it("enforces limits on quote and note", () => {
      const quoteField = quoteSection.fields.find((f) => f.name === "quote");
      const noteField = quoteSection.fields.find((f) => f.name === "note");

      const quoteRule = createMockRule();
      (quoteField?.validation as ValidationFn | undefined)?.(quoteRule);
      expect(quoteRule.required).toHaveBeenCalled();
      expect(quoteRule.max).toHaveBeenCalledWith(90);

      const noteRule = createMockRule();
      (noteField?.validation as ValidationFn | undefined)?.(noteRule);
      expect(noteRule.max).toHaveBeenCalledWith(90);
    });

    it("validates quoteAccent against quote matching case", () => {
      const quoteAccentField = quoteSection.fields.find((f) => f.name === "quoteAccent");
      const validator = captureCustomValidator(quoteAccentField?.validation);
      expect(validator).toBeDefined();

      const context = { parent: { quote: "Good code is its own documentation." } };

      expect(validator!(undefined, context)).toBe(true);
      expect(validator!("", context)).toBe(true);
      expect(validator!("   ", context)).toBe(true);
      expect(validator!("Good code", context)).toBe(true);
      expect(validator!("documentation.", context)).toBe(true);

      expect(validator!("good code", context)).toBe(
        "Quote accent must appear in the quote with matching case.",
      );
      expect(validator!("not in quote", context)).toBe(
        "Quote accent must appear in the quote with matching case.",
      );
    });

    it("prepares preview safely with fallbacks", () => {
      const preview = quoteSection.preview;
      expect(preview?.prepare?.({ title: "My quote", subtitle: "My note" })).toEqual({
        title: "My quote",
        subtitle: "My note",
      });
      expect(preview?.prepare?.({ title: undefined, subtitle: undefined })).toEqual({
        title: "Quote",
        subtitle: "Pull quote",
      });
    });
  });

  describe("processSection", () => {
    it("enforces limits on heading, intro, steps, step label, step heading, and tools", () => {
      const headingField = processSection.fields.find((f) => f.name === "heading");
      const introField = processSection.fields.find((f) => f.name === "intro");
      const stepsField = processSection.fields.find((f) => f.name === "steps") as {
        validation?: unknown;
        of?: Array<{ fields?: Array<{ name: string; validation?: unknown }> }>;
      };

      const headingRule = createMockRule();
      (headingField?.validation as ValidationFn | undefined)?.(headingRule);
      expect(headingRule.required).toHaveBeenCalled();
      expect(headingRule.max).toHaveBeenCalledWith(50);

      const introRule = createMockRule();
      (introField?.validation as ValidationFn | undefined)?.(introRule);
      expect(introRule.max).toHaveBeenCalledWith(120);

      const stepsRule = createMockRule();
      (stepsField?.validation as ValidationFn | undefined)?.(stepsRule);
      expect(stepsRule.max).toHaveBeenCalledWith(5);

      const stepFields = stepsField?.of?.[0]?.fields ?? [];
      const labelField = stepFields.find((f) => f.name === "label");
      const stepHeadingField = stepFields.find((f) => f.name === "heading");
      const toolsField = stepFields.find((f) => f.name === "tools");

      const labelRule = createMockRule();
      (labelField?.validation as ValidationFn | undefined)?.(labelRule);
      expect(labelRule.required).toHaveBeenCalled();
      expect(labelRule.max).toHaveBeenCalledWith(16);

      const stepHeadingRule = createMockRule();
      (stepHeadingField?.validation as ValidationFn | undefined)?.(stepHeadingRule);
      expect(stepHeadingRule.required).toHaveBeenCalled();
      expect(stepHeadingRule.max).toHaveBeenCalledWith(40);

      const toolsRule = createMockRule();
      (toolsField?.validation as ValidationFn | undefined)?.(toolsRule);
      expect(toolsRule.max).toHaveBeenCalledWith(4);
      expect(toolsRule.unique).toHaveBeenCalled();
    });

    it("prepares preview with 0, 1, and 3 steps without crashing", () => {
      const preview = processSection.preview;
      const prepare = preview?.prepare as (val: { title?: string; steps?: unknown[] }) => {
        title: string;
        subtitle: string;
      };

      expect(prepare({ title: "My Process", steps: [] })).toEqual({
        title: "My Process",
        subtitle: "0 steps",
      });
      expect(prepare({ title: "My Process", steps: [{ _key: "1" }] })).toEqual({
        title: "My Process",
        subtitle: "1 step",
      });
      expect(
        prepare({
          title: undefined,
          steps: [{ _key: "1" }, { _key: "2" }, { _key: "3" }],
        }),
      ).toEqual({
        title: "Process",
        subtitle: "3 steps",
      });
    });
  });

  describe("experienceSection", () => {
    it("enforces limits on intro, roles, role, company, startDate, outcome, and tools", () => {
      const introField = experienceSection.fields.find((f) => f.name === "intro");
      const rolesField = experienceSection.fields.find((f) => f.name === "roles") as {
        validation?: unknown;
        of?: Array<{ fields?: Array<{ name: string; validation?: unknown }> }>;
      };

      const introRule = createMockRule();
      (introField?.validation as ValidationFn | undefined)?.(introRule);
      expect(introRule.max).toHaveBeenCalledWith(180);

      const rolesRule = createMockRule();
      (rolesField?.validation as ValidationFn | undefined)?.(rolesRule);
      expect(rolesRule.max).toHaveBeenCalledWith(5);

      const roleFields = rolesField?.of?.[0]?.fields ?? [];
      const roleField = roleFields.find((f) => f.name === "role");
      const companyField = roleFields.find((f) => f.name === "company");
      const startDateField = roleFields.find((f) => f.name === "startDate");
      const outcomeField = roleFields.find((f) => f.name === "outcome");
      const toolsField = roleFields.find((f) => f.name === "tools");

      const roleRule = createMockRule();
      (roleField?.validation as ValidationFn | undefined)?.(roleRule);
      expect(roleRule.required).toHaveBeenCalled();
      expect(roleRule.max).toHaveBeenCalledWith(40);

      const companyRule = createMockRule();
      (companyField?.validation as ValidationFn | undefined)?.(companyRule);
      expect(companyRule.required).toHaveBeenCalled();
      expect(companyRule.max).toHaveBeenCalledWith(40);

      const startDateRule = createMockRule();
      (startDateField?.validation as ValidationFn | undefined)?.(startDateRule);
      expect(startDateRule.required).toHaveBeenCalled();

      const outcomeRule = createMockRule();
      (outcomeField?.validation as ValidationFn | undefined)?.(outcomeRule);
      expect(outcomeRule.max).toHaveBeenCalledWith(150);

      const toolsRule = createMockRule();
      (toolsField?.validation as ValidationFn | undefined)?.(toolsRule);
      expect(toolsRule.max).toHaveBeenCalledWith(4);
      expect(toolsRule.unique).toHaveBeenCalled();
    });

    it("validates endDate: valid when current, error when missing, error when before start, valid when after start", () => {
      const rolesField = experienceSection.fields.find((f) => f.name === "roles") as {
        of?: Array<{ fields?: Array<{ name: string; validation?: unknown; hidden?: (ctx: { parent?: unknown }) => boolean }> }>;
      };
      const endDateField = rolesField?.of?.[0]?.fields?.find((f) => f.name === "endDate");
      const validator = captureCustomValidator(endDateField?.validation);
      expect(validator).toBeDefined();

      // Valid when current is true
      expect(validator!(undefined, { parent: { current: true } })).toBe(true);
      expect(validator!("2020-01-01", { parent: { current: true } })).toBe(true);

      // Error when missing while current is false/unset
      expect(validator!(undefined, { parent: { current: false } })).toBe(
        "Add an end date, or turn on Current.",
      );
      expect(validator!("", { parent: { current: false } })).toBe(
        "Add an end date, or turn on Current.",
      );

      // Error when endDate is before startDate
      expect(
        validator!("2022-01-01", {
          parent: { current: false, startDate: "2023-01-01" },
        }),
      ).toBe("The end date can't be before the start date.");

      // Valid when endDate is after startDate
      expect(
        validator!("2024-01-01", {
          parent: { current: false, startDate: "2023-01-01" },
        }),
      ).toBe(true);
    });

    it("hides endDate when current is true", () => {
      const rolesField = experienceSection.fields.find((f) => f.name === "roles") as {
        of?: Array<{ fields?: Array<{ name: string; hidden?: (ctx: { parent?: unknown }) => boolean }> }>;
      };
      const endDateField = rolesField?.of?.[0]?.fields?.find((f) => f.name === "endDate");
      expect(endDateField?.hidden?.({ parent: { current: true } })).toBe(true);
      expect(endDateField?.hidden?.({ parent: { current: false } })).toBe(false);
      expect(endDateField?.hidden?.({ parent: undefined })).toBe(false);
    });

    it("prepares experienceSection preview with 0, 1, and 3 roles without crashing", () => {
      const preview = experienceSection.preview;
      const prepare = preview?.prepare as (val: { title?: string; roles?: unknown[] }) => {
        title: string;
        subtitle: string;
      };

      expect(prepare({ title: "My Experience", roles: [] })).toEqual({
        title: "My Experience",
        subtitle: "0 roles",
      });
      expect(prepare({ title: "My Experience", roles: [{ _key: "1" }] })).toEqual({
        title: "My Experience",
        subtitle: "1 role",
      });
      expect(
        prepare({
          title: undefined,
          roles: [{ _key: "1" }, { _key: "2" }, { _key: "3" }],
        }),
      ).toEqual({
        title: "Experience",
        subtitle: "3 roles",
      });
    });

    it("prepares role item preview correctly for current and past roles", () => {
      const rolesField = experienceSection.fields.find((f) => f.name === "roles") as {
        of?: Array<{
          preview?: {
            prepare?: (val: {
              title?: string;
              company?: string;
              startDate?: string;
              endDate?: string;
              current?: boolean;
            }) => { title: string; subtitle: string };
          };
        }>;
      };
      const rolePrepare = rolesField?.of?.[0]?.preview?.prepare;
      expect(rolePrepare).toBeDefined();

      const currentPreview = rolePrepare!({
        title: "Senior Developer",
        company: "Company",
        startDate: "2024-01-01",
        current: true,
      });
      expect(currentPreview).toEqual({
        title: "Senior Developer",
        subtitle: "Company · 2024 — Present",
      });

      const pastPreview = rolePrepare!({
        title: "Frontend Developer",
        company: "Company",
        startDate: "2022-01-01",
        endDate: "2024-01-01",
        current: false,
      });
      expect(pastPreview).toEqual({
        title: "Frontend Developer",
        subtitle: "Company · 2022 — 2024",
      });
    });
  });

  describe("ctaSection", () => {
    it("enforces limits on heading and intro", () => {
      const headingField = ctaSection.fields.find((f) => f.name === "heading");
      const introField = ctaSection.fields.find((f) => f.name === "intro");

      const headingRule = createMockRule();
      (headingField?.validation as ValidationFn | undefined)?.(headingRule);
      expect(headingRule.required).toHaveBeenCalled();
      expect(headingRule.max).toHaveBeenCalledWith(60);

      const introRule = createMockRule();
      (introField?.validation as ValidationFn | undefined)?.(introRule);
      expect(introRule.max).toHaveBeenCalledWith(120);
    });

    it("has cta field with title and description mentioning ROUTES_BY_TYPE", () => {
      const ctaField = ctaSection.fields.find((f) => f.name === "cta") as {
        title?: string;
        description?: string;
      };
      expect(ctaField).toBeDefined();
      expect(ctaField.title).toBe("Call to action");
      expect(ctaField.description).toContain("ROUTES_BY_TYPE");
    });

    it("prepares preview safely with fallbacks", () => {
      const preview = ctaSection.preview;
      expect(preview?.prepare?.({ title: "Ready?", subtitle: "Get in touch" })).toEqual({
        title: "Ready?",
        subtitle: "Get in touch",
      });
      expect(preview?.prepare?.({ title: undefined, subtitle: undefined })).toEqual({
        title: "Call to action",
        subtitle: "Call to action",
      });
    });
  });
});
