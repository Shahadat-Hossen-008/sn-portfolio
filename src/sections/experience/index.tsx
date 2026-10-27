import { AccentHeading } from "@/components/accent-heading";
import { TagList } from "@/components/tag-list";
import { formatPeriod } from "@/sections/shared/section-formatting";
import type { IExperienceProps } from "./interface";

export function ExperienceSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  roles,
}: IExperienceProps) {
  const hasRoles = roles.length > 0;

  return (
    <section
      aria-labelledby="experience-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-8">
        <div className="grid grid-cols-1 gap-16 pt-32 bento:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-4">
            {eyebrow && (
              <p className="font-mono text-label uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            <AccentHeading
              as="h2"
              id="experience-heading"
              text={heading}
              accent={headingAccent}
              className="font-display text-heading font-normal text-balance"
            />
            {intro && (
              <p className="mt-2 max-w-[23.75rem] text-base leading-[1.6] text-muted-foreground">
                {intro}
              </p>
            )}
          </div>
          {hasRoles ? (
            <ul className="border-b border-foreground/20">
              {roles.map((role) => (
                <li
                  key={role._key}
                  className="grid grid-cols-1 gap-6 border-t border-foreground/20 py-7 bento:grid-cols-[150px_minmax(0,1fr)]"
                >
                  <div className="font-mono text-label uppercase text-muted-foreground pt-2">
                    {formatPeriod(role.startDate, role.endDate, role.current)}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-display text-title font-normal">
                      {role.role}
                    </h3>
                    <p className="text-base font-semibold text-foreground">
                      {role.company}
                    </p>
                    {role.outcome && (
                      <p className="text-base leading-[1.6] text-muted-foreground">
                        {role.outcome}
                      </p>
                    )}
                    <TagList tags={role.tools} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
