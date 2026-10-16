import { describe, expect, it } from "vitest";
import { createSchema } from "sanity";

import { schema } from "@/sanity/schemaTypes";

/**
 * The project's schema must compile: `createSchema` runs Sanity's own
 * validation (unresolved annotation types, duplicate names, bad `rule`s) and is
 * exactly the gate `sanity schema extract` / `pnpm typegen` relies on.
 *
 * This catches the class of error where a registered type is referenced by
 * another schema (e.g. a Portable Text annotation, an object field) but is not
 * resolvable — the failure mode being `Could not resolve jsonType of undefined`.
 */
describe("schema", () => {
  it("compiles with no validation errors", () => {
    expect(() =>
      createSchema({ name: "sn-portfolio", types: schema.types }),
    ).not.toThrow();
  });
});
