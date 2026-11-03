/** Projection for the `technicalFoundation` block on pageSections. */
export const technicalFoundationFragment = /* groq */ `{
  eyebrow,
  statement,
  columns[]{
    _key,
    title,
    skills[]{
      _key,
      context,
      "label": tech->label
    }
  }
}`;
