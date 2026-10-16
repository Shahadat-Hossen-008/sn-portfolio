import { describe, expect, it } from "vitest";

import { structure } from "@/sanity/structure";
import { globalSchemas } from "@/sanity/schemaTypes";

/**
 * `sanity build` cannot be used as a gate in this repo: the Studio is mounted
 * inside Next.js (`basePath: "/studio"`), so it is bundled by `next build` with
 * `tsconfig` path resolution — the Sanity CLI's bundler does not read `paths`.
 *
 * This test stands in for it by executing `structure()` for real against a
 * recording stub of the `StructureBuilder` API. That is enough to prove the
 * singleton is pinned and its document id is fixed, which is what makes
 * `*[_type == "siteSettings"][0]` safe.
 *
 * Values are recorded on a `v` bag rather than on the node itself, because the
 * builder methods (`title`, `id`, …) share names with the values they set.
 */
type Values = {
  title?: string;
  id?: string;
  schemaType?: string;
  documentId?: string;
  items?: StubNode[];
  child?: StubNode;
};
type StubNode = { kind: string; v: Values };

function makeNode(kind: string): StubNode {
  const node: StubNode = { kind, v: {} };

  const methods: Record<string, unknown> = {
    title: (value: string) => ((node.v.title = value), node),
    id: (value: string) => ((node.v.id = value), node),
    schemaType: (value: string) => ((node.v.schemaType = value), node),
    documentId: (value: string) => ((node.v.documentId = value), node),
    icon: () => node,
    items: (value: StubNode[]) => ((node.v.items = value), node),
    child: (value: StubNode) => ((node.v.child = value), node),
    divider: () => makeNode("divider"),
    document: () => makeNode("document"),
    list: () => makeNode("list"),
    listItem: () => makeNode("listItem"),
    documentTypeListItem: (schemaType: string) => {
      const item = makeNode("documentTypeListItem");
      item.v.schemaType = schemaType;
      return item;
    },
  };

  return Object.assign(node, methods) as unknown as StubNode;
}

describe("structure()", () => {
  const result = structure(makeNode("root") as never) as unknown as StubNode;
  const items: StubNode[] = result.v.items ?? [];
  const pinned = items.filter((item) => item.kind === "documentTypeListItem");

  it("pins every registered singleton at the very top", () => {
    expect(pinned.map((item) => item.v.schemaType)).toEqual(
      globalSchemas.map((schema) => schema.name),
    );
    expect(items[0]).toBe(pinned[0]);
    expect(items[1]).toBe(pinned[1]);
    expect(items[2]?.kind).toBe("divider");
  });

  it("opens each singleton at its fixed document id", () => {
    expect(pinned.length).toBeGreaterThan(0);

    for (const item of pinned) {
      expect(item.v.id).toBe(item.v.schemaType);
      expect(item.v.child?.kind).toBe("document");
      expect(item.v.child?.v.documentId).toBe(item.v.schemaType);
    }
  });

  it("still lists pages, entities and miscellaneous below the singletons", () => {
    expect(items.filter((item) => item.kind === "divider")).toHaveLength(3);
    expect(items.filter((item) => item.kind === "listItem")).toHaveLength(3);
  });
});