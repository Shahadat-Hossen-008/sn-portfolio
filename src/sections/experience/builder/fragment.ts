/** Projection for the `experienceSection` block on pageSections. */
export const experienceSectionFragment = /* groq */ `{
  eyebrow,
  intro,
  roles[]{
    _key,
    role,
    company,
    startDate,
    endDate,
    current,
    description,
    contribution,
    impact,
    featured,
    outcome,
    "project": project->{
      _id,
      "title": projectTitle,
      "slug": slug.current
    },
    "tools": tools[]->{ _id, label }
  }
}`;
