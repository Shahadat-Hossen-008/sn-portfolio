import { describe, it, expect, vi } from "vitest";
import {
  type ArrayOfObjectsMember,
  type ArraySchemaType,
  type ObjectMember,
  type ObjectSchemaType,
  type Path,
} from "sanity";

function isTextBlockOrSpan(member: ArrayOfObjectsMember): boolean {
  if (member.kind !== "item") return false;
  const value = member.item?.value as { _type?: string } | undefined;
  const typeName = member.item?.schemaType?.name || value?._type;
  return typeName === "block" || typeName === "span";
}

function checkMembersHaveOpenModal(
  members: ArrayOfObjectsMember[] | undefined,
): boolean {
  if (!Array.isArray(members)) return false;

  for (const member of members) {
    if (member.kind !== "item") continue;

    if (!isTextBlockOrSpan(member) && member.open) {
      return true;
    }

    const nestedMembers = member.item?.members as ObjectMember[] | undefined;
    if (!Array.isArray(nestedMembers)) continue;

    for (const nested of nestedMembers) {
      if (nested.kind !== "field") continue;
      const fieldInput = nested.field as {
        members?: ArrayOfObjectsMember[];
      };
      if (
        Array.isArray(fieldInput?.members) &&
        checkMembersHaveOpenModal(fieldInput.members)
      ) {
        return true;
      }
    }
  }

  return false;
}

function findOpenModalKey(
  members: ArrayOfObjectsMember[] | undefined,
): string | null {
  if (!Array.isArray(members)) return null;

  for (const member of members) {
    if (member.kind !== "item") continue;

    if (!isTextBlockOrSpan(member) && member.open) {
      return member.key;
    }

    const nestedMembers = member.item?.members as ObjectMember[] | undefined;
    if (Array.isArray(nestedMembers)) {
      for (const nested of nestedMembers) {
        if (nested.kind !== "field") continue;
        const fieldInput = nested.field as {
          members?: ArrayOfObjectsMember[];
        };
        if (
          Array.isArray(fieldInput?.members) &&
          checkMembersHaveOpenModal(fieldInput.members)
        ) {
          return member.key;
        }
      }
    }
  }

  return null;
}

const mockArraySchemaType = {
  jsonType: "array",
  name: "array",
} as unknown as ArraySchemaType;

const mockObjectSchemaType = (name: string): ObjectSchemaType =>
  ({
    jsonType: "object",
    name,
  }) as unknown as ObjectSchemaType;

describe("PortableTextInput modal detection and caret navigation", () => {
  it("does NOT treat a normal text block with member.open=true as an open modal", () => {
    const textBlockMember: ArrayOfObjectsMember = {
      kind: "item",
      key: "block-1",
      index: 0,
      open: true,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "block-1",
        schemaType: mockObjectSchemaType("block"),
        value: { _type: "block", _key: "block-1", children: [] },
        members: [],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    expect(findOpenModalKey([textBlockMember])).toBeNull();
  });

  it("does NOT treat active text spans (schemaType.name === 'span', open: true) inside block.children as open modals", () => {
    const textBlockWithOpenSpan: ArrayOfObjectsMember = {
      kind: "item",
      key: "block-1",
      index: 0,
      open: true,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "block-1",
        schemaType: mockObjectSchemaType("block"),
        value: {
          _type: "block",
          _key: "block-1",
          children: [{ _type: "span", _key: "span-1", text: "Hello" }],
        },
        members: [
          {
            kind: "field",
            name: "children",
            field: {
              members: [
                {
                  kind: "item",
                  key: "span-1",
                  index: 0,
                  open: true,
                  collapsed: false,
                  collapsible: true,
                  parentSchemaType: mockArraySchemaType,
                  item: {
                    id: "span-1",
                    schemaType: mockObjectSchemaType("span"),
                    value: { _type: "span", _key: "span-1", text: "Hello" },
                    members: [],
                  } as unknown as ArrayOfObjectsMember["item"],
                },
              ],
            },
          } as unknown as ObjectMember,
        ],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    expect(findOpenModalKey([textBlockWithOpenSpan])).toBeNull();
  });

  it("DOES detect when an Editorial Section object block has an open modal", () => {
    const editorialMember: ArrayOfObjectsMember = {
      kind: "item",
      key: "editorial-1",
      index: 1,
      open: true,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "editorial-1",
        schemaType: mockObjectSchemaType("editorialSection"),
        value: { _type: "editorialSection", _key: "editorial-1" },
        members: [],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    expect(findOpenModalKey([editorialMember])).toBe("editorial-1");
  });

  it("DOES detect when an annotation modal inside markDefs is open", () => {
    const textBlockWithOpenAnnotation: ArrayOfObjectsMember = {
      kind: "item",
      key: "block-1",
      index: 0,
      open: true,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "block-1",
        schemaType: mockObjectSchemaType("block"),
        value: { _type: "block", _key: "block-1", children: [] },
        members: [
          {
            kind: "field",
            name: "markDefs",
            field: {
              members: [
                {
                  kind: "item",
                  key: "link-1",
                  index: 0,
                  open: true,
                  collapsed: false,
                  collapsible: true,
                  parentSchemaType: mockArraySchemaType,
                  item: {
                    id: "link-1",
                    schemaType: mockObjectSchemaType("linkUrl"),
                    value: { _type: "linkUrl", _key: "link-1", href: "https://example.com" },
                  } as unknown as ArrayOfObjectsMember["item"],
                },
              ],
            },
          } as unknown as ObjectMember,
        ],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    expect(findOpenModalKey([textBlockWithOpenAnnotation])).toBe("block-1");
  });

  it("suppresses selection events from the nested Editorial Section editor", () => {
    const editorialMember: ArrayOfObjectsMember = {
      kind: "item",
      key: "editorial-1",
      index: 1,
      open: true,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "editorial-1",
        schemaType: mockObjectSchemaType("editorialSection"),
        value: { _type: "editorialSection", _key: "editorial-1" },
        members: [],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    const members = [editorialMember];
    const openModalKey = findOpenModalKey(members);
    expect(openModalKey).toBe("editorial-1");

    const onPathFocus = vi.fn();
    const handlePathFocus = (
      nextFocusPath: Path,
      payload?: { selection?: unknown },
    ) => {
      if (openModalKey !== null && payload !== undefined && "selection" in payload) {
        return;
      }
      onPathFocus(nextFocusPath, payload);
    };

    // User is moving the caret in editorialSection.body. The nested Slate
    // editor owns this selection and must not send it through the parent form.
    const selectionPayload = {
      selection: {
        anchor: { path: [{ _key: "inner-block-1" }, "children", { _key: "span-1" }], offset: 8 },
        focus: { path: [{ _key: "inner-block-1" }, "children", { _key: "span-1" }], offset: 8 },
      },
    };

    // Path as forwarded to the parent caseStudy array:
    const nestedFocusPath: Path = [
      { _key: "editorial-1" },
      "body",
      { _key: "inner-block-1" },
      "children",
      { _key: "span-1" },
      "text",
    ];

    handlePathFocus(nestedFocusPath, selectionPayload);

    expect(onPathFocus).not.toHaveBeenCalled();
  });

  it("SUPPRESSES background editor selection events when Editorial Section is open to protect focus", () => {
    const editorialMember: ArrayOfObjectsMember = {
      kind: "item",
      key: "editorial-1",
      index: 1,
      open: true,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "editorial-1",
        schemaType: mockObjectSchemaType("editorialSection"),
        value: { _type: "editorialSection", _key: "editorial-1" },
        members: [],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    const members = [editorialMember];
    const openModalKey = findOpenModalKey(members);

    const onPathFocus = vi.fn();
    const handlePathFocus = (
      nextFocusPath: Path,
      payload?: { selection?: unknown },
    ) => {
      if (openModalKey !== null && payload !== undefined && "selection" in payload) {
        return;
      }
      onPathFocus(nextFocusPath, payload);
    };

    // Background editor selection event for an unrelated block outside the modal:
    const backgroundSelectionPayload = {
      selection: {
        anchor: { path: [{ _key: "outside-block-99" }, "children", { _key: "span-1" }], offset: 0 },
        focus: { path: [{ _key: "outside-block-99" }, "children", { _key: "span-1" }], offset: 0 },
      },
    };

    const backgroundFocusPath: Path = [
      { _key: "outside-block-99" },
      "children",
      { _key: "span-1" },
      "text",
    ];

    handlePathFocus(backgroundFocusPath, backgroundSelectionPayload);

    // Must be suppressed to prevent focus theft from the open modal!
    expect(onPathFocus).not.toHaveBeenCalled();
  });

  it("ALLOWS single-segment focus path ([{ _key }]) when no modal is open and the block exists in members, enabling single-click selection of Editorial Section", () => {
    const closedEditorialMember: ArrayOfObjectsMember = {
      kind: "item",
      key: "editorial-1",
      index: 0,
      open: false,
      collapsed: false,
      collapsible: true,
      parentSchemaType: mockArraySchemaType,
      item: {
        id: "editorial-1",
        schemaType: mockObjectSchemaType("editorialSection"),
        value: { _type: "editorialSection", _key: "editorial-1" },
        members: [],
      } as unknown as ArrayOfObjectsMember["item"],
    };

    const members = [closedEditorialMember];
    const openModalKey = findOpenModalKey(members);
    expect(openModalKey).toBeNull();

    const onPathFocus = vi.fn();
    const handlePathFocus = (
      nextFocusPath: Path,
      payload?: { selection?: unknown },
    ) => {
      if (nextFocusPath.length <= 1) {
        if (openModalKey !== null) return;
        const firstSegment = nextFocusPath[0];
        const targetKey =
          typeof firstSegment === "object" &&
          firstSegment !== null &&
          "_key" in firstSegment
            ? (firstSegment as { _key: string })._key
            : null;
        const memberExists =
          targetKey !== null &&
          Boolean(members.some((m) => m.kind === "item" && m.key === targetKey));
        if (!memberExists) return;
      }
      if (openModalKey !== null && payload !== undefined && "selection" in payload) {
        return;
      }
      onPathFocus(nextFocusPath, payload);
    };

    const singleClickPath: Path = [{ _key: "editorial-1" }];
    const singleClickPayload = {
      selection: {
        anchor: { path: [{ _key: "editorial-1" }], offset: 0 },
        focus: { path: [{ _key: "editorial-1" }], offset: 0 },
      },
    };

    handlePathFocus(singleClickPath, singleClickPayload);
    expect(onPathFocus).toHaveBeenCalledWith(singleClickPath, singleClickPayload);

    // Uncommitted block (newly inserted via toolbar before members updates) is suppressed:
    onPathFocus.mockClear();
    handlePathFocus([{ _key: "newly-inserted-99" }], singleClickPayload);
    expect(onPathFocus).not.toHaveBeenCalled();
  });
});
