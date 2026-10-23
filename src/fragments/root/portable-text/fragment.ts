import { LINK_REFERENCE_FRAGMENT } from "@/fragments/root/link/fragment";

/**
 * Shared Portable Text array projection that expands internal `link` references
 * inside `markDefs`.
 */
export const PORTABLE_TEXT_PROJECTION = /* groq */ `[]{
  ...,
  markDefs[]{..., ${LINK_REFERENCE_FRAGMENT}}
}`;
