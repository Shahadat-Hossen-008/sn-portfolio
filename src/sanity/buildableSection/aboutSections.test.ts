import { describe, expect, it, vi } from "vitest";

import { pageSection } from "@/sanity/_root/sections";
import { ctaSection } from "@/sanity/buildableSection/ctaSection";
import { experienceSection } from "@/sanity/buildableSection/experienceSection";
import { philosophySection } from "@/sanity/buildableSection/philosophySection";
import { quoteSection } from "@/sanity/buildableSection/quoteSection";
import { technicalFoundation } from "@/sanity/buildableSection/technicalFoundation";
import { sections } from "@/sanity/schemaTypes";

type MockRule = {
  max: ReturnType<typeof vi.fn>;
  min: ReturnType<typeof vi.fn>;
  required: ReturnType<typeof vi.fn>;
  unique: ReturnType<typeof vi.fn>;
  custom: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
};

type ValidationFn = (rule: unknown) => unknown;

const createMockRule = (): MockRule => {
  const mockRule: MockRule = {
    max: vi.fn().mockReturnThis(),
    min: vi.fn().mockReturnThis(),
    required: vi.fn().mockReturnThis(),
    unique: vi.fn().mockReturnThis(),
    custom: vi.fn().mockReturnThis(),
    error: vi.fn().mockReturnThis(),
  };
  return mockRule;
};

const captureCustomValidator = (validationFn: unknown) => {
  let validator:
    | ((value: unknown, context: unknown) => true | string)
    | undefined;
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
    quoteSection,
    technicalFoundation,
    philosophySection,
    experienceSection,
    ctaSection,
  ];

  it("registers the About page section documents in order", () => {
    for (const section of newSections) {
      expect(section.type).toBe("document");
      expect(sections.some((s) => s.name === section.name)).toBe(true);
    }

    const sectionNames = sections.map((s) => s.name);
    const pillarsIndex = sectionNames.indexOf("engineeringPillars");
    expect(pillarsIndex).toBeGreaterThan(-1);

    expect(
      sectionNames.slice(pillarsIndex + 1, pillarsIndex + 6),
    ).toEqual([
      "quoteSection",
      "technicalFoundation",
      "philosophySection",
      "experienceSection",
      "ctaSection",
    ]);
  });

  it("registers each section as a reference member in pageSections", () => {
    const ofList = pageSection.of as Array<{
      name?: string;
      type: string;
      to?: Array<{ type: string }>;
    }>;
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
      "personalIntroSection",
      "engineeringPillars",
      "quoteSection",
      "technicalFoundation",
      "philosophySection",
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
      const membershipCount = groups.filter((g) =>
        g.of?.includes(section.name),
      ).length;
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
          typeof field.description === "string" &&
            field.description.trim().length > 0,
          `Expected non-empty description on ${section.name}.${field.name}`,
        ).toBe(true);

        if (field.type === "array" && Array.isArray(field.of)) {
          for (const member of field.of) {
            if (Array.isArray(member.fields)) {
              for (const subField of member.fields) {
                expect(
                  typeof subField.description === "string" &&
                    subField.description.trim().length > 0,
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
      const quoteAccentField = quoteSection.fields.find(
        (f) => f.name === "quoteAccent",
      );
      const validator = captureCustomValidator(quoteAccentField?.validation);
      expect(validator).toBeDefined();

      const context = {
        parent: { quote: "Good code is its own documentation." },
      };

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
      expect(
        preview?.prepare?.({ title: "My quote", subtitle: "My note" }),
      ).toEqual({
        title: "My quote",
        subtitle: "My note",
      });
      expect(
        preview?.prepare?.({ title: undefined, subtitle: undefined }),
      ).toEqual({
        title: "Quote",
        subtitle: "Pull quote",
      });
    });
  });

  describe("technicalFoundation", () => {
    it("enforces limits on eyebrow, statement, and columns", () => {
      const eyebrowField = technicalFoundation.fields.find(
        (f) => f.name === "eyebrow",
      );
      const statementField = technicalFoundation.fields.find(
        (f) => f.name === "statement",
      );
      const columnsField = technicalFoundation.fields.find(
        (f) => f.name === "columns",
      ) as {
        validation?: unknown;
        of?: Array<{ fields?: Array<{ name: string; validation?: unknown }> }>;
      };

      const eyebrowRule = createMockRule();
      (eyebrowField?.validation as ValidationFn | undefined)?.(eyebrowRule);
      expect(eyebrowRule.required).toHaveBeenCalled();

      const statementRule = createMockRule();
      (statementField?.validation as ValidationFn | undefined)?.(statementRule);
      expect(statementRule.required).toHaveBeenCalled();
      expect(statementRule.max).toHaveBeenCalledWith(400);

      const columnsRule = createMockRule();
      (columnsField?.validation as ValidationFn | undefined)?.(columnsRule);
      expect(columnsRule.max).toHaveBeenCalledWith(4);

      const columnFields = columnsField?.of?.[0]?.fields ?? [];
      const titleField = columnFields.find((f) => f.name === "title");
      const skillsField = columnFields.find((f) => f.name === "skills");

      const titleRule = createMockRule();
      (titleField?.validation as ValidationFn | undefined)?.(titleRule);
      expect(titleRule.required).toHaveBeenCalled();
      expect(titleRule.max).toHaveBeenCalledWith(30);

      const skillsRule = createMockRule();
      (skillsField?.validation as ValidationFn | undefined)?.(skillsRule);
      expect(skillsRule.required).toHaveBeenCalled();
      expect(skillsRule.min).toHaveBeenCalledWith(1);

      const skillFields =
        (
          skillsField as {
            of?: Array<{
              fields?: Array<{ name: string; validation?: unknown }>;
            }>;
          }
        )?.of?.[0]?.fields ?? [];
      const techField = skillFields.find((f) => f.name === "tech");
      const contextField = skillFields.find((f) => f.name === "context");

      const techRule = createMockRule();
      (techField?.validation as ValidationFn | undefined)?.(techRule);
      expect(techRule.required).toHaveBeenCalled();

      const contextRule = createMockRule();
      (contextField?.validation as ValidationFn | undefined)?.(contextRule);
      expect(contextRule.max).toHaveBeenCalledWith(30);
    });

    it("prepares preview with title and statement without crashing", () => {
      const preview = technicalFoundation.preview;
      const prepare = preview?.prepare as (val: {
        title?: string;
        statement?: string;
        columns?: unknown[];
      }) => {
        title: string;
        subtitle: string;
      };

      expect(
        prepare({
          title: "Technical Foundation",
          statement: "Overview of tech stack",
          columns: [],
        }),
      ).toEqual({
        title: "Technical Foundation",
        subtitle: "Overview of tech stack",
      });
      expect(
        prepare({
          title: undefined,
          statement: undefined,
          columns: [{ _key: "1" }],
        }),
      ).toEqual({
        title: "Technical Foundation",
        subtitle: "1 column",
      });
    });
  });

  describe("philosophySection", () => {
    it("enforces validation on title, eyebrow, and items", () => {
      const titleField = philosophySection.fields.find((f) => f.name === "title");
      const eyebrowField = philosophySection.fields.find((f) => f.name === "eyebrow");
      const itemsField = philosophySection.fields.find((f) => f.name === "items") as {
        validation?: unknown;
        of?: Array<{ fields?: Array<{ name: string; validation?: unknown }> }>;
      };

      const titleRule = createMockRule();
      (titleField?.validation as ValidationFn | undefined)?.(titleRule);
      expect(titleRule.max).toHaveBeenCalledWith(60);

      const eyebrowRule = createMockRule();
      (eyebrowField?.validation as ValidationFn | undefined)?.(eyebrowRule);
      expect(eyebrowRule.required).toHaveBeenCalled();

      const itemsRule = createMockRule();
      (itemsField?.validation as ValidationFn | undefined)?.(itemsRule);
      expect(itemsRule.required).toHaveBeenCalled();
      expect(itemsRule.min).toHaveBeenCalledWith(1);
      expect(itemsRule.max).toHaveBeenCalledWith(6);

      const itemFields = itemsField?.of?.[0]?.fields ?? [];
      const pTitle = itemFields.find((f) => f.name === "title");
      const pDesc = itemFields.find((f) => f.name === "description");
      const pTag = itemFields.find((f) => f.name === "tag");

      const pTitleRule = createMockRule();
      (pTitle?.validation as ValidationFn | undefined)?.(pTitleRule);
      expect(pTitleRule.required).toHaveBeenCalled();
      expect(pTitleRule.max).toHaveBeenCalledWith(40);

      const pDescRule = createMockRule();
      (pDesc?.validation as ValidationFn | undefined)?.(pDescRule);
      expect(pDescRule.required).toHaveBeenCalled();
      expect(pDescRule.max).toHaveBeenCalledWith(400);

      const pTagRule = createMockRule();
      (pTag?.validation as ValidationFn | undefined)?.(pTagRule);
      expect(pTagRule.max).toHaveBeenCalledWith(30);
    });

    it("prepares preview with title, eyebrow, and count of items", () => {
      const preview = philosophySection.preview;
      const prepare = preview?.prepare as (val: {
        title?: string;
        eyebrow?: string;
        items?: unknown[];
      }) => {
        title: string;
        subtitle: string;
      };

      expect(
        prepare({
          title: "My Philosophy",
          eyebrow: "PHILOSOPHY",
          items: [{}, {}],
        }),
      ).toEqual({
        title: "My Philosophy",
        subtitle: "2 principles",
      });
      expect(
        prepare({
          title: undefined,
          eyebrow: "PHILOSOPHY",
          items: [{}],
        }),
      ).toEqual({
        title: "PHILOSOPHY",
        subtitle: "1 principle",
      });
    });
  });

  describe("experienceSection", () => {
    it("enforces limits on intro, roles, role, company, startDate, outcome, and tools", () => {
      const introField = experienceSection.fields.find(
        (f) => f.name === "intro",
      );
      const rolesField = experienceSection.fields.find(
        (f) => f.name === "roles",
      ) as {
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
      const rolesField = experienceSection.fields.find(
        (f) => f.name === "roles",
      ) as {
        of?: Array<{
          fields?: Array<{
            name: string;
            validation?: unknown;
            hidden?: (ctx: { parent?: unknown }) => boolean;
          }>;
        }>;
      };
      const endDateField = rolesField?.of?.[0]?.fields?.find(
        (f) => f.name === "endDate",
      );
      const validator = captureCustomValidator(endDateField?.validation);
      expect(validator).toBeDefined();

      // Valid when current is true
      expect(validator!(undefined, { parent: { current: true } })).toBe(true);
      expect(validator!("2020-01-01", { parent: { current: true } })).toBe(
        true,
      );

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
      const rolesField = experienceSection.fields.find(
        (f) => f.name === "roles",
      ) as {
        of?: Array<{
          fields?: Array<{
            name: string;
            hidden?: (ctx: { parent?: unknown }) => boolean;
          }>;
        }>;
      };
      const endDateField = rolesField?.of?.[0]?.fields?.find(
        (f) => f.name === "endDate",
      );
      expect(endDateField?.hidden?.({ parent: { current: true } })).toBe(true);
      expect(endDateField?.hidden?.({ parent: { current: false } })).toBe(
        false,
      );
      expect(endDateField?.hidden?.({ parent: undefined })).toBe(false);
    });

    it("prepares experienceSection preview with 0, 1, and 3 roles without crashing", () => {
      const preview = experienceSection.preview;
      const prepare = preview?.prepare as (val: {
        title?: string;
        roles?: unknown[];
      }) => {
        title: string;
        subtitle: string;
      };

      expect(prepare({ title: "My Experience", roles: [] })).toEqual({
        title: "My Experience",
        subtitle: "0 roles",
      });
      expect(
        prepare({ title: "My Experience", roles: [{ _key: "1" }] }),
      ).toEqual({
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
      const rolesField = experienceSection.fields.find(
        (f) => f.name === "roles",
      ) as {
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
      expect(
        preview?.prepare?.({ title: "Ready?", subtitle: "Get in touch" }),
      ).toEqual({
        title: "Ready?",
        subtitle: "Get in touch",
      });
      expect(
        preview?.prepare?.({ title: undefined, subtitle: undefined }),
      ).toEqual({
        title: "Call to action",
        subtitle: "Call to action",
      });
    });
  });
});
