import { describe, expect, it } from "vitest";
import type { DocumentActionComponent, Template } from "sanity";

import { schema, singletonDocumentActions } from "@/sanity/schemaTypes";

/**
 * Gate: "Verify the Studio opens the fixed singletons and cannot create
 * accidental duplicates."
 *
 * The sidebar pinning itself is exercised by `sanity build`; what is unit
 * testable is the two guards that stop a *second* copy existing: the type is
 * removed from the create-new templates, and its destructive document actions
 * are stripped.
 */
describe("singleton registration", () => {
  const singletonNames = [
    "siteSettings",
    "layout",
    "myProfilePage",
    "aboutPage",
    "projectPage",
    "blogPage",
  ];

  it("registers siteSettings and layout exactly once in schema.types", () => {
    for (const name of singletonNames) {
      const occurrences = schema.types.filter((type) => type.name === name);
      expect(occurrences).toHaveLength(1);
    }
  });

  it("filters the singletons out of the create-new templates", () => {
    const templates = [
      { id: "siteSettings", schemaType: "siteSettings" },
      { id: "layout", schemaType: "layout" },
      { id: "myProfilePage", schemaType: "myProfilePage" },
      { id: "blogPage", schemaType: "blogPage" },
      { id: "blogPost", schemaType: "blogPost" },
    ] as unknown as Template[];

    expect(schema.templates(templates).map((t) => t.id)).toEqual(["blogPost"]);
  });

  it("registers heroSection and mounts it on the profile page", () => {
    const heroSection = schema.types.find((type) => type.name === "heroSection");
    const profile = schema.types.find((type) => type.name === "myProfilePage");
    const fields = profile && "fields" in profile ? profile.fields : undefined;
    const heroField = fields?.find((field) => field.name === "hero");

    expect(heroSection?.type).toBe("object");
    expect(heroField?.type).toBe("heroSection");
  });
});

describe("singletonDocumentActions", () => {
  const actions = (...names: string[]) =>
    names.map((action) => ({ action }) as DocumentActionComponent);

  const singletonNames = [
    "siteSettings",
    "layout",
    "myProfilePage",
    "aboutPage",
    "projectPage",
    "blogPage",
  ];

  it.each(singletonNames)("strips delete and duplicate for %s", (schemaType) => {
    const result = singletonDocumentActions(
      actions("publish", "delete", "duplicate", "unpublish"),
      { schemaType } as never,
    );

    expect(result.map((a) => a.action)).toEqual(["publish", "unpublish"]);
  });

  it("leaves every other schema type untouched", () => {
    const prev = actions("publish", "delete", "duplicate", "unpublish");

    expect(
      singletonDocumentActions(prev, { schemaType: "blogPost" } as never),
    ).toBe(prev);
    expect(
      singletonDocumentActions(prev, { schemaType: "project" } as never),
    ).toBe(prev);
  });
});
