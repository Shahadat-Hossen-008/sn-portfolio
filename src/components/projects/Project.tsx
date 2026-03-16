"use client";

import { projectProps } from "@/app/types/projectTypes";
import { format } from "date-fns";
import { parseISO } from "date-fns/fp";
import { PortableText } from "next-sanity";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import LeftIcon from "../../../public/LeftIcon";
import RightIcon from "../../../public/RightIcon";

export default function Project({ projects }: projectProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const goToPrev = () => emblaApi?.canScrollPrev() && emblaApi.scrollPrev();
  const goToNext = () => emblaApi?.canScrollNext() && emblaApi.scrollNext();
  return (
    <section id="projects" className="relative py-10 lg:py-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-1/3 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto text-white flex flex-col gap-8 md:gap-12 overflow-hidden bg-black px-4 sm:px-6 lg:px-20">
        <h2 className="text-3xl md:text-5xl text-white leading-tight tracking-[0.02em] text-center">
          Project
        </h2>
        <div
          className="relative pb-12 rounded-2xl bg-black/50 flex flex-col gap-8 max-w-4xl w-full mx-auto"
          style={
            {
              "--slide-size": "100%",
              "--slide-gap": "20px",
            } as React.CSSProperties
          }
        >
          <div className="overflow-hidden relative" ref={emblaRef}>
            <div className="flex [touch-action:pan-y_pinch-zoom]">
              {projects &&
                projects
                  // filter out null projects only valid projects will be rendered
                  .filter(
                    (project): project is NonNullable<typeof project> =>
                      project !== null,
                  )
                  .map((project) => (
                    <div
                      key={project._id}
                      className="flex-[0_0_var(--slide-size)] bg-white/5 border border-white/10 rounded-2xl  mr-(--slide-gap)"
                    >
                      <div className="w-full pb-4 lg:pb-6 lg:max-h-115">
                        <Image
                          src={project.projectImage || ""}
                          alt={project.projectTitle}
                          width={500}
                          height={400}
                          className="w-full h-auto rounded-tl-2xl rounded-tr-2xl"
                        />
                      </div>
                      <div className="flex-1 text-base p-4 lg:p-10">
                        <h3 className="text-2xl font-semibold mb-2">
                          {project.projectTitle}
                        </h3>
                        <p className="pb-4 font-mono">
                          Project Duretion:{" "}
                          {format(parseISO(project.start || ""), "LLL d, yyyy")}{" "}
                          - {format(parseISO(project.end || ""), "LLL d, yyyy")}
                        </p>
                        <PortableText value={project.projectDescription} />
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block bg-white text-[#212121] rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-gray-200 mr-5"
                        >
                          View Project
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block bg-white text-[#212121] rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-gray-200"
                        >
                          Github
                        </a>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <button
            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 lg:-translate-x-4 items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-colors duration-300 cursor-pointer"
            onClick={goToPrev}
          >
            <LeftIcon />
          </button>
          <button
            className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 lg:translate-x-4 items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-colors duration-300 cursor-pointer"
            onClick={goToNext}
          >
            <RightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
