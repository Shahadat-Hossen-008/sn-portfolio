import { RadialGradientBackground } from "../background/RadialGradientBackground";
import { aboutProps } from "@/app/types/aboutType";
import { PortableText } from "next-sanity";
import { portableTextComponents } from "@/components/portableText/PortableTextComponent";

export default function About({ about }: aboutProps) {
  if (!about) return null;
  const { description, technologies } = about;
  return (
    <section id="about" className="relative py-20">
      <RadialGradientBackground variant="about" />
      <div className="container mx-auto text-foreground leading-tight tracking-[0.02em] flex flex-col gap-8 md:gap-12 overflow-hidden bg-background px-4 sm:px-6 lg:px-20 py-10">
        <h2 className="text-3xl md:text-5xl text-foreground leading-tight tracking-[0.02em]">
          About
        </h2>
        <div className="flex flex-col md:flex-row gap-20 justify-between">
          <div className="flex-2">
            <div className="flex flex-col gap-3 pt-5">
              {description && (
                <div className="text-base text-foreground/70">
                  <PortableText
                    value={description}
                    components={portableTextComponents}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xl text-foreground">Technologies I use:</p>
            <div className="flex flex-wrap gap-3 pt-5">
              {technologies?.map((tech) => (
                <p
                  key={tech.label}
                  className="text-base text-foreground border border-primary/30 rounded-full px-4 py-1 bg-primary/10"
                >
                  {tech.label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}