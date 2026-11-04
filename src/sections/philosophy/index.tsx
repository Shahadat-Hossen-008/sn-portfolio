import type { IPhilosophyProps } from "./interface";

export function PhilosophySection({
  eyebrow = "PHILOSOPHY",
  items,
}: IPhilosophyProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="philosophy-eyebrow"
      className="bg-background text-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        {/* Subtle hairline top border perfectly aligned with Header pill bounds */}
        <div className="border-t border-foreground/15 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column: Eyebrow Label with optical top alignment */}
            <div className="md:col-span-4 lg:col-span-3">
              {eyebrow && (
                <p
                  id="philosophy-eyebrow"
                  className="font-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-muted-foreground pt-1 sm:pt-1.5"
                >
                  {eyebrow}
                </p>
              )}
            </div>

            {/* Right Column: 2-Column Philosophy Cards Grid */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {items.map((item, idx) => (
                  <div
                    key={item._key || idx}
                    className="flex flex-col justify-between bg-surface border border-foreground/10 rounded-2xl p-6 sm:p-7"
                  >
                    <div>
                      <h3 className="font-sans text-base sm:text-lg font-bold text-foreground tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-3 font-sans text-sm sm:text-base font-normal leading-[1.6] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    {item.tag && (
                      <p className="mt-6 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                        {item.tag}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhilosophySection;
