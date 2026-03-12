import { ProfileProps } from "@/app/types/profileTypes";
import { RadialGradientBackground } from "../background/RadialGradientBackground";
import { PortableText } from "next-sanity";
import SanityImage from "../image/Image";

export default function Profile({ profile }: ProfileProps) {
  // If profile data is not available, return null to avoid rendering the component
  if (!profile) return null;
  const { fullName, headline, image, cvUrl, bio } = profile;
  return (
    <section className="min-h-screen relative pt-20">
      <RadialGradientBackground variant="hero" />
      <div className="container mx-auto min-h-screen  py-20 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 overflow-hidden bg-black px-4 sm:px-6 lg:px-20">
        <div className="flex-2 flex flex-col items-start gap-4 md:gap-5">
          <span className="tracking-[1.2px] text-xs md:text-sm">
            Hey, I&apos;m
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-[0.02em]">
            {fullName}
          </h1>
          <h4 className="px-4.5 py-5.5 bg-linear-to-r from-primary/10 via-primary/15 to-primary/20 border border-primary/20 rounded-full font-semibold inline-block text-white text-xs md:text-sm tracking-[1.2px]">
            {headline}
          </h4>
          {bio && <div className="text-base text-white/70">
                     <PortableText value={bio} />
                  </div>}
          <div className="flex gap-5 items-center">
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#212121] rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-gray-200"
              >
                Download CV
              </a>
            )}
            <a
              href={"contactMe"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#212121] rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-gray-200"
            >
              Get in Touch
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          {image && (
            <SanityImage
              image={image}
              alt={fullName}
              width={300}
              height={300}
              className="rounded-lg"
            />
          )}
        </div>
      </div>
    </section>
  );
}
