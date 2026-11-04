import { splitHeadline } from "@/lib/hero";
import type { ISectionHeadingProps } from "./interface";

export function SectionHeading({
  as: HeadingTag = "h1",
  id,
  eyebrow,
  heading,
  headingAccent,
  className = "flex flex-col gap-4 sm:gap-6 max-w-4xl",
  eyebrowClassName = "font-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-muted-foreground",
  headingClassName = "font-display text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1.04] tracking-tight text-balance text-foreground",
}: ISectionHeadingProps) {
  const parts = splitHeadline(heading, headingAccent);

  return (
    <div className={className}>
      {eyebrow && <p className={eyebrowClassName}>{eyebrow}</p>}

      <HeadingTag id={id} className={headingClassName}>
        {parts.length === 3 ? (
          <>
            {parts[0]}
            <em className="block font-display italic font-normal not-italic:font-normal text-foreground mt-1 sm:mt-2">
              {parts[1]}
            </em>
            {parts[2]}
          </>
        ) : (
          heading
        )}
      </HeadingTag>
    </div>
  );
}

export default SectionHeading;
