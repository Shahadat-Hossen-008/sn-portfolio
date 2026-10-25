export const countLabel = (
  count: number | undefined,
  singular: string,
  plural = `${singular}s`,
) => {
  const n = count ?? 0;
  return `${n} ${n === 1 ? singular : plural}`;
};

/** "2024 — Present" from a start date, an optional end date and a current flag. */
export const periodYears = (
  startDate?: string,
  endDate?: string,
  current?: boolean,
) => {
  const start = startDate?.slice(0, 4);
  const end = current ? "Present" : endDate?.slice(0, 4);
  return [start, end].filter(Boolean).join(" — ");
};
