import { SectionHeading } from "@/components/section-heading";
import { SanityImage } from "@/components/image";
import type { IAboutIntroProps } from "./interface";

export function AboutIntroSection({
  eyebrow,
  heading,
  headingAccent,
  portrait,
  intro,
  body,
}: IAboutIntroProps) {
  const hasPortrait = Boolean(portrait?.imageFile);

  return (
    <section
      aria-labelledby="about-intro-heading"
      className="bg-background text-foreground pb-16 lg:pb-24"
    >
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16">
        {/* Reusable Section Header Primitive */}
        <SectionHeading
          as="h1"
          id="about-intro-heading"
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
        />

        {/* Content Row: Dedicated portrait on the left + Detail info on the right in middle position */}
        <div
          className={`mt-10 lg:mt-14 grid grid-cols-1 gap-8 lg:gap-12 items-center max-w-4xl ${
            hasPortrait
              ? "md:grid-cols-[minmax(0,280px)_1fr] lg:grid-cols-[minmax(0,320px)_1fr]"
              : "max-w-3xl"
          }`}
        >
          {hasPortrait && (
            <div className="relative aspect-4/5 w-full max-w-70 sm:max-w-[320px] overflow-hidden rounded-2xl bg-foreground/5 border border-foreground/10 shadow-sm">
              <SanityImage
                image={portrait!.imageFile!}
                alt={portrait?.altText || "Author portrait"}
                width={640}
                height={800}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-5 max-w-xl">
            {intro && (
              <p className="text-xl sm:text-2xl font-sans font-normal leading-relaxed text-foreground">
                {intro}
              </p>
            )}
            {body && (
              <p className="text-base sm:text-lg font-sans leading-relaxed text-muted-foreground">
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
