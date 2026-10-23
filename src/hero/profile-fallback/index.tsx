import { RadialGradientBackground } from "@/components/background";
import type { IProfileFallbackProps } from "./interface";

export function ProfileFallback({
  fullName,
  headline,
  cvUrl,
}: IProfileFallbackProps) {
  return (
    <section className="min-h-screen relative pt-20">
      <RadialGradientBackground variant="hero" />
      <div className="container mx-auto min-h-screen  py-20 flex flex-col justify-center gap-8 md:gap-12 overflow-hidden bg-background px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-start gap-4 md:gap-5">
          <span className="tracking-[1.2px] text-xs md:text-sm">
            Hey, I&apos;m
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-[0.02em]">
            {fullName}
          </h1>
          {headline && (
            <h4 className="px-4.5 py-5.5 bg-linear-to-r from-primary/10 via-primary/15 to-primary/20 border border-primary/20 rounded-full font-semibold inline-block text-foreground text-xs md:text-sm tracking-[1.2px]">
              {headline}
            </h4>
          )}
          <div className="flex gap-5 items-center">
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-limestone text-forest rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-soft-limestone"
              >
                Download CV
              </a>
            )}
            <a
              href={"contactMe"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-limestone text-forest rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-soft-limestone"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileFallback;
