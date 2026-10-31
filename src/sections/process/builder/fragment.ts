/** Projection for the `processSection` block on pageSections. */
export const processSectionFragment = /* groq */ `{
  eyebrow,
  heading,
  headingAccent,
  intro,
  steps[]{
    _key,
    label,
    heading,
    "tools": tools[]->{ _id, label }
  }
}`;
