import Link from "next/link";
import { formatPeriod } from "@/sections/shared/section-formatting";
import type { IExperienceProps } from "./interface";

export function ExperienceSection({
  eyebrow = "EXPERIENCE",
  intro,
  roles,
}: IExperienceProps) {
  if (!roles || roles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="experience-eyebrow"
      className="bg-background text-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="border-t border-foreground/15 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column: Eyebrow Label & Optional Intro matching Philosophy & Technical Foundation */}
            <div className="md:col-span-4 lg:col-span-3">
              {eyebrow && (
                <p
                  id="experience-eyebrow"
                  className="font-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-muted-foreground"
                >
                  {eyebrow}
                </p>
              )}
              {intro && (
                <p className="mt-4 font-sans text-sm sm:text-base font-normal leading-[1.6] text-muted-foreground text-pretty">
                  {intro}
                </p>
              )}
            </div>

            {/* Right Column: Roles Timeline in clean Urbanist sans-serif */}
            <div className="md:col-span-8 lg:col-span-9">
              <ul className="flex flex-col divide-y divide-foreground/15">
                {roles.map((role) => {
                  const impactText = role.impact || role.outcome;

                  return (
                    <li
                      key={role._key}
                      className="py-7 first:pt-0 last:pb-0 flex flex-col gap-3"
                    >
                      {/* Quiet Metadata: Date range, status badge & milestone pill */}
                      <div className="flex flex-wrap items-center gap-2.5 font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        <span>
                          {formatPeriod(
                            role.startDate,
                            role.endDate,
                            role.current,
                          )}
                        </span>
                        {role.current && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground border border-foreground/15">
                            <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
                            Present
                          </span>
                        )}
                        {role.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                            Key Milestone
                          </span>
                        )}
                      </div>

                      {/* Role Title & Company in Urbanist (font-sans) */}
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <h3 className="font-sans text-base sm:text-lg font-bold text-foreground tracking-tight">
                          {role.role}
                        </h3>
                        <span className="font-sans text-sm sm:text-lg font-semibold text-foreground/80">
                          · {role.company}
                        </span>
                      </div>

                      {/* Role Context / Description */}
                      {role.description && (
                        <p className="font-sans text-sm sm:text-base font-normal leading-relaxed text-muted-foreground">
                          {role.description}
                        </p>
                      )}

                      {/* Contribution: What was built, approached, or delivered */}
                      {role.contribution && (
                        <div className="mt-1 flex flex-col gap-1">
                          <span className="font-sans text-sm sm:text-base font-semibold uppercase tracking-wider text-muted-foreground/80">
                            Contribution
                          </span>
                          <p className="font-sans text-sm font-normal leading-relaxed text-foreground sm:text-base">
                            {role.contribution}
                          </p>
                        </div>
                      )}

                      {/* Impact / Result (Soft Limestone surface tint, subtle forest border) */}
                      {impactText && (
                        <div className="mt-1 rounded-lg border-l-2 border-foreground/30 bg-surface/75 px-4 py-3">
                          <span className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-1">
                            {role.impact ? "Impact & Result" : "Key Outcome"}
                          </span>
                          <p className="font-sans text-sm font-medium leading-relaxed text-foreground">
                            {impactText}
                          </p>
                        </div>
                      )}

                      {/* Tools & Optional Case Study Link */}
                      {(role.tools.length > 0 || role.project?.slug) && (
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 pt-1">
                          {role.tools.length > 0 && (
                            <ul
                              className="flex flex-wrap gap-1.5"
                              aria-label="Technologies used"
                            >
                              {role.tools.map((tool) => (
                                <li
                                  key={tool._id}
                                  className="rounded-full border border-foreground/15 bg-surface/50 px-2.5 py-0.5 font-sans text-xs text-muted-foreground"
                                >
                                  {tool.label}
                                </li>
                              ))}
                            </ul>
                          )}

                          {role.project?.slug && (
                            <Link
                              href={`/project/${role.project.slug}`}
                              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-foreground hover:text-foreground/80 hover:underline transition-colors ml-auto"
                            >
                              <span>
                                {role.project.title
                                  ? `Case Study: ${role.project.title}`
                                  : "View case study"}
                              </span>
                              <span aria-hidden="true" className="text-xs">
                                ↗
                              </span>
                            </Link>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
