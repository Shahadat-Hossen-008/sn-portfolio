import { splitHeadline } from "@/lib/hero";
import { Button } from "@/components/button";
import type { ICtaSectionProps } from "./interface";

export function CtaSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  cta,
}: ICtaSectionProps) {
  const parts = splitHeadline(heading, headingAccent);
  const hasRightColumn = Boolean(intro || cta);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <section
          data-surface="forest"
          aria-labelledby="cta-heading"
          className={`cta-band mt-20 lg:mt-28 w-full p-8 sm:p-12 lg:p-16 rounded-panel text-foreground ${
            hasRightColumn
              ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              : "flex flex-col items-start gap-6 sm:gap-8"
          }`}
        >
          <div
            className={
              hasRightColumn
                ? "lg:col-span-7 flex flex-col gap-4 sm:gap-5"
                : "max-w-3xl flex flex-col gap-4 sm:gap-5"
            }
          >
            {eyebrow && (
              <p className="font-sans text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}

            <h2
              id="cta-heading"
              className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.625rem] font-bold leading-[1.12] tracking-tight text-foreground"
            >
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <em className="block font-display italic font-normal not-italic:font-normal text-foreground mt-1 sm:mt-1.5">
                    {parts[1]}
                  </em>
                  {parts[2]}
                </>
              ) : (
                heading
              )}
            </h2>
          </div>

          {hasRightColumn && (
            <div className="lg:col-span-5 flex flex-col items-start gap-6 sm:gap-7">
              {intro && (
                <p className="font-sans text-base sm:text-lg font-normal leading-[1.6] text-muted-foreground max-w-md">
                  {intro}
                </p>
              )}

              {cta && (
                <Button
                  variant="mint"
                  href={cta.href}
                  external={cta.openInNewTab}
                  className="group inline-flex items-center gap-3 rounded-full bg-mint px-7 py-3.5 sm:py-4 text-forest transition-colors duration-200 hover:bg-lime"
                >
                  <span className="font-sans font-bold text-xs sm:text-[13px] tracking-[0.14em] uppercase text-forest">
                    {cta.label}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CtaSection;
