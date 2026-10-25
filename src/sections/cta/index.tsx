import { AccentHeading } from "@/components/accent-heading";
import { Button } from "@/components/button";
import type { ICtaSectionProps } from "./interface";

export function CtaSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  cta,
}: ICtaSectionProps) {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-page px-8">
        <section
          data-surface="forest"
          aria-labelledby="cta-heading"
          className="cta-band mt-32 grid grid-cols-1 gap-12 p-8 bento:p-12 bento:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] bento:items-end rounded-panel text-foreground"
        >
          <div className="flex flex-col gap-4">
            {eyebrow && (
              <p className="font-mono text-label uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            <AccentHeading
              as="h2"
              id="cta-heading"
              text={heading}
              accent={headingAccent}
              className="font-display text-heading font-normal text-balance"
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            {intro && <p className="text-lead text-muted-foreground">{intro}</p>}
            {cta && (
              <Button
                variant="mint"
                href={cta.href}
                external={cta.openInNewTab}
              >
                <span>{cta.label}</span>
                <span aria-hidden="true">→</span>
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CtaSection;
