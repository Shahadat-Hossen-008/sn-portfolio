"use client";
import { Tech } from "@/app/types/technologyType";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
export default function Technology({ technology }: Tech) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({ stopOnInteraction: false }),
  ]);
  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-2/5 w-98 h-98 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-98 h-98 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-1/3 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
      </div>
      <div
        className="container mx-auto px-4 lg:px-20"
        style={
          {
            "--slide-size": "20%",
            "--slide-sm-size": "33.33%",
          } as React.CSSProperties
        }
      >
        <h2 className="text-3xl font-bold pb-5 md:pb-10 text-center">
          Technologies
        </h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y touch-pinch-zoom">
            {technology.map((tech) => (
              <div
                className="lg:flex-[0_0_var(--slide-size)] flex-[0_0_var(--slide-sm-size)]"
                key={tech._id}
              >
                {tech.labelIcon && (
                  <Image
                    src={tech.labelIcon}
                    alt={tech.label}
                    width={80}
                    height={100}
                    className="max-w-12 lg:max-w-20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
