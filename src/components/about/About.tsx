import Image from "next/image";
import { RadialGradientBackground } from "../background/RadialGradientBackground";
import { aboutProps } from "@/app/types/aboutType";
import { PortableText } from "next-sanity";

export default function About({ about }: aboutProps) {
  if (!about) return null;
  const { description, socialIcons, technologies } = about;
  return (
    <section id="about" className="relative py-20">
      <RadialGradientBackground variant="about" />
      <div className="container mx-auto text-white leading-tight tracking-[0.02em] flex flex-col gap-8 md:gap-12 overflow-hidden bg-black px-4 sm:px-6 lg:px-20 py-10">
        <h2 className="text-3xl md:text-5xl text-white leading-tight tracking-[0.02em]">
          About
        </h2>
        <div className="flex flex-col md:flex-row gap-20 justify-between">
          <div className="flex-2">
            <div className="flex flex-col gap-3 pt-5">
              <div className="text-base text-white/70">
                <PortableText value={description} />
              </div>
              <div className=" flex items-center gap-1 flex-wrap">
                <p className="text-xl text-white">My social links:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {socialIcons &&
                    socialIcons
                      .filter(
                        (icon) => icon.label && icon.url && icon.imageIcon,
                      )
                      .map((icon) => (
                        //( !) use this because here we filter social icon that it will not give null
                        <a
                          href={icon.url!}
                          key={icon._key}
                          target="_blank"
                          className="pl-2"
                        >
                          <Image
                            src={icon.imageIcon!}
                            alt={icon.label!}
                            width={36}
                            height={36}
                          />
                        </a>
                      ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xl text-white">Technologies I use:</p>
            <div className="flex flex-wrap gap-3 pt-5">
              {technologies &&
                technologies.map((tech) => (
                  <p
                    key={tech._id}
                    className="text-base text-white border border-primary/30 rounded-full px-4 py-1 bg-primary/10"
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
