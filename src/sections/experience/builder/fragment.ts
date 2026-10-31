/** Projection for the `experienceSection` block on pageSections. */
export const experienceSectionFragment = /* groq */ `{
  eyebrow,
  heading,
  headingAccent,
  intro,
  roles[]{
    _key,
    role,
    company,
    startDate,
    endDate,
    current,
    outcome,
    "tools": tools[]->{ _id, label }
  }
}`;
