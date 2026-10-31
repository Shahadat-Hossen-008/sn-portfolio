import { LINK_REFERENCE_FRAGMENT } from "@/fragments/root/link/fragment";

const INLINE_BLOCK_PROJECTION = /* groq */ `{
  ...,
  markDefs[]{..., ${LINK_REFERENCE_FRAGMENT}}
}`;

/**
 * Shared Portable Text array projection that expands internal `link` references
 * inside top-level `markDefs` as well as nested rich text inside
 * `editorialSection` and `portableTable` blocks.
 */
export const PORTABLE_TEXT_PROJECTION = /* groq */ `[]{
  ...,
  markDefs[]{..., ${LINK_REFERENCE_FRAGMENT}},
  _type == "editorialSection" => {
    ...,
    body[]${INLINE_BLOCK_PROJECTION}
  },
  _type == "portableTable" => {
    ...,
    rows[]{
      ...,
      cells[]{
        ...,
        content[]${INLINE_BLOCK_PROJECTION}
      }
    }
  }
}`;
