import { useCallback, useMemo } from "react";
import {
  isArrayOfBlocksSchemaType,
  type ArrayOfObjectsInputProps,
  type ArrayOfObjectsMember,
  type InputProps,
  type ObjectMember,
  type Path,
} from "sanity";

function checkMembersHaveOpenModal(
  members: ArrayOfObjectsMember[] | undefined,
): boolean {
  if (!Array.isArray(members)) return false;

  for (const member of members) {
    if (member.kind !== "item") continue;
    if (member.open) return true;

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

function PortableTextArrayInput(props: ArrayOfObjectsInputProps) {
  const { members, onPathFocus } = props;

  const hasOpenMember = useMemo(
    () => checkMembersHaveOpenModal(members),
    [members],
  );

  const handlePathFocus = useCallback(
    (
      nextFocusPath: Path,
      payload?: Parameters<ArrayOfObjectsInputProps["onPathFocus"]>[1],
    ) => {
      // Ignore single-segment paths (`[{ _key }]`) which target non-text block objects
      // at their root and cause `DocumentPaneProvider.handleFocus` in Sanity v4.22.1
      // to strip `{ _key }` from `openPath`, immediately closing the block object modal.
      if (nextFocusPath.length <= 1) {
        return;
      }

      // While an object modal is open, ignore background editor selection sync events
      // triggered by value updates so they cannot steal focus from modal inputs.
      if (hasOpenMember && payload !== undefined && "selection" in payload) {
        return;
      }

      onPathFocus(nextFocusPath, payload);
    },
    [hasOpenMember, onPathFocus],
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
