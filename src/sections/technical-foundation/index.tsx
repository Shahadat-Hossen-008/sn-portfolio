import type { ITechnicalFoundationProps } from "./interface";

export function TechnicalFoundationSection({
  eyebrow = "TECHNICAL FOUNDATION",
  statement,
  columns,
}: ITechnicalFoundationProps) {
  if (!statement && (!columns || columns.length === 0)) {
    return null;
  }

  return (
    <section
      aria-label={eyebrow || "Technical Foundation"}
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        {/* Subtle hairline top border perfectly aligned with Header pill left/right bounds */}
        <div className="border-t border-foreground/15 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column: Eyebrow Label with optical top alignment matching lead statement cap-height */}
            <div className="md:col-span-4 lg:col-span-3">
              {eyebrow && (
                <p className="font-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-muted-foreground pt-1 sm:pt-1.5">
                  {eyebrow}
                </p>
              )}
            </div>

            {/* Right Column: Lead Statement + Category Columns */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col">
              {statement && (
                <p className="font-sans text-lg sm:text-xl font-normal leading-[1.6] text-foreground max-w-reading">
                  {statement}
                </p>
              )}

              {columns && columns.length > 0 && (
                <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
                  {columns.map((col, idx) => (
                    <div key={col._key || idx} className="flex flex-col">
                      <h3 className="font-sans text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-foreground">
                        {col.title}
                      </h3>
                      {col.skills && col.skills.length > 0 && (
                        <ul className="mt-4 sm:mt-5 flex flex-col gap-2.5">
                          {col.skills.map((skill, sIdx) => (
                            <li
                              key={skill._key || sIdx}
                              className="font-sans text-sm sm:text-base text-muted-foreground font-normal leading-snug"
                            >
                              <span className="text-foreground font-medium">
                                {skill.label}
                              </span>
                              {skill.context && (
                                <span className="text-muted-foreground ml-1.5 font-normal">
                                  ({skill.context})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechnicalFoundationSection;
