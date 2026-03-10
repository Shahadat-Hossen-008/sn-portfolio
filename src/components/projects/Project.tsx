import { projectProps } from "@/app/types/projectTypes";
import { format } from "date-fns";
import { parseISO } from "date-fns/fp";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

export default function Project({ projects }: projectProps) {
  console.log(projects);

  return (
    <section
      id="projects"
      className="min-h-screen relative py-20 overflow-hidden"
    >
      <div className="container mx-auto text-white py-10 lg:py-20 flex flex-col gap-8 md:gap-12 overflow-hidden bg-black px-4 sm:px-6 lg:px-20">
        <h2 className="text-3xl md:text-5xl text-white leading-tight tracking-[0.02em]">
          Project
        </h2>
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
                className="relative pb-12 overflow-hidden rounded-2xl bg-black/50 p-6 flex flex-col lg:flex-row gap-8"
              >
                {/* Background gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 -right-1/3 w-96 h-96 bg-primary/20 opacity-20 rounded-full blur-3xl" />
                </div>
                <div>
                  <Image
                    src={project.projectImage || ""}
                    alt={project.projectTitle}
                    width={500}
                    height={500}
                  />
                </div>
                <div className="flex-1 text-base pb-3">
                  <h3 className="text-2xl font-semibold mb-2">
                    {project.projectTitle}
                  </h3>
                  <p className="pb-4 font-mono">Project Duretion: {format(parseISO(project.start || ''), 'LLL d, yyyy')} -  {format(parseISO(project.end || ''), 'LLL d, yyyy')}</p>
                  <PortableText value={project.projectDescription}/>
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
    </section>
  );
}
