import { useCallback, useMemo } from "react";
import {
  isArrayOfBlocksSchemaType,
  type ArrayOfObjectsInputProps,
  type ArrayOfObjectsMember,
  type InputProps,
  type ObjectMember,
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

function PortableTextArrayInput(props: ArrayOfObjectsInputProps) {
  const { members, onPathFocus } = props;

  const openModalKey = useMemo(() => findOpenModalKey(members), [members]);

  const handlePathFocus = useCallback(
    (
      nextFocusPath: Path,
      payload?: Parameters<ArrayOfObjectsInputProps["onPathFocus"]>[1],
    ) => {
      // Ignore single-segment paths (`[{ _key }]`) when a modal is already open or when
      // a newly inserted block has not yet been committed to `members`, preventing
      // `DocumentPaneProvider.handleFocus` in Sanity v4.22.1 from stripping `{ _key }`
      // from `openPath` and closing the block object modal. When no modal is open and
      // the target block already exists in `members`, allow `[{ _key }]` through so
      // single-clicking a block object selects it instead of snapping the caret back
      // to the previously focused text block via `useTrackFocusPath`.
      if (nextFocusPath.length <= 1) {
        if (openModalKey !== null) {
          return;
        }

        const firstSegment = nextFocusPath[0];
        const targetKey =
          typeof firstSegment === "object" &&
          firstSegment !== null &&
          "_key" in firstSegment
            ? (firstSegment as { _key: string })._key
            : null;
        const memberExists =
          targetKey !== null &&
          Boolean(
            members?.some((m) => m.kind === "item" && m.key === targetKey),
          );

        if (!memberExists) {
          return;
        }
      }

      // While an object block (e.g. editorialSection, image) or annotation modal is open
      // on this Portable Text array, ignore background Slate selection sync events so they
      // cannot steal focus from the active modal inputs.
      if (
        openModalKey !== null &&
        payload !== undefined &&
        "selection" in payload
      ) {
        return;
      }

      onPathFocus(nextFocusPath, payload);
    },
    [members, onPathFocus, openModalKey],
  );

  return props.renderDefault({
    ...props,
    onPathFocus: handlePathFocus,
  });
}

/**
 * Global Studio input wrapper registered once in `sanity.config.ts`.
 * Automatically applies the Sanity v4.22.1 Portable Text modal focus fix to all
 * Portable Text (`array` of `block`) fields without requiring per-schema `components`.
 *
 * Why this exists: on `sanity@4.22.1`, opening an object block dialog in Portable Text
 * (image, code, youtube, editorialSection, table, …) collapses `openPath` in
 * `useDocumentForm.handleFocus` as soon as focus lands on the block, so the dialog
 * closes immediately. The two guards below suppress that focus round-trip.
 *
 * Removal condition: upstream fixed this in `sanity@6.9.2` (sanity-io/sanity#13924),
 * but `6.9.2`–`6.14.0` shipped a Portable Text data-loss regression, so the first safe
 * target is `sanity >= 6.14.1`. After upgrading, delete this wrapper and its
 * `sanity.config.ts` wiring, then re-verify: image upload inside Portable Text keeps
 * the block dialog open, `editorialSection` fields keep focus, and nested dialogs
 * (table rows/cells, card items) do not steal focus. The `selection`-payload guard is
 * defensive and is not guaranteed to be covered by #13924.
 */
export function CustomPortableTextInput(props: InputProps) {
  if (isArrayOfBlocksSchemaType(props.schemaType)) {
    return <PortableTextArrayInput {...(props as ArrayOfObjectsInputProps)} />;
  }

  return props.renderDefault(props);
}
