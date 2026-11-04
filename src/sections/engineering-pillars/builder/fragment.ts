/** Projection for the `engineeringPillars` block on pageSections. */
export const engineeringPillarsFragment = /* groq */ `{
  title,
  columns[]{
    _key,
    label,
    statement,
    items
  }
}`;
