import { AccentHeading } from "@/components/accent-heading";
import type { IAboutIntroProps } from "./interface";

export function AboutIntroSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  body,
}: IAboutIntroProps) {
  return (
    <section
      aria-labelledby="about-intro-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-8">
        <div className="grid grid-cols-1 gap-16 pt-12 pb-24 bento:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] bento:items-end">
          <div className="flex flex-col gap-6">
            {eyebrow && (
              <p className="font-mono text-label uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            <AccentHeading
              as="h1"
              id="about-intro-heading"
              text={heading}
              accent={headingAccent}
              className="font-display text-display font-normal text-balance"
            />
          </div>
          <div className="flex flex-col gap-5">
            {intro && <p className="text-lead text-foreground">{intro}</p>}
            {body && (
              <p className="text-base leading-[1.6] text-muted-foreground">
                {body}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutIntroSection;
