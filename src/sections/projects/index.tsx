import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SanityImage } from "@/components/image";
import type { IProjectsSectionProps } from "./interface";

export function ProjectsSection({
  eyebrow,
  heading,
  headingAccent,
  projects,
}: IProjectsSectionProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  // Collect unique category/tech tags for showcase display
  const allTags = Array.from(
    new Map(
      projects.flatMap((p) => p.stack ?? []).map((t) => [t._id, t.label]),
    ).values(),
  ).slice(0, 5);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-background text-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 pt-6 sm:pt-10 pb-20 sm:pb-28 lg:pb-36">
        {/* Showcase Section Heading */}
        <SectionHeading
          as="h1"
          id="projects-heading"
          eyebrow={eyebrow || "SELECTED ARCHIVE"}
          heading={heading || "The work lives on its own pages."}
          headingAccent={headingAccent ?? "pages."}
        />

        {/* Filter / Category Tab Bar (Prepared for future tag filtering) */}
        <div className="mt-10 sm:mt-12 border-b border-foreground/15 pb-5 mb-14 sm:mb-20 lg:mb-24 flex flex-wrap items-center gap-3">
          <span className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-foreground bg-surface px-3 py-1.5 rounded-full border border-foreground/15">
            ALL PROJECTS
          </span>
          {allTags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-muted-foreground px-3 py-1.5 rounded-full transition-colors hover:text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Alternating Zig-Zag Showcase Grid */}
        <div className="flex flex-col gap-16 sm:gap-24 lg:gap-32">
          {projects.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <article
                key={project._id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
              >
                {/* Project Media Mockup */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {project.projectImage?.imageFile ? (
                    <Link
                      href={project.slug ? `/projects/${project.slug}` : "#"}
                      className="group block relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-foreground/15 bg-surface/50 shadow-sm transition-transform duration-300 hover:scale-[1.01]"
                    >
                      <SanityImage
                        image={project.projectImage.imageFile}
                        alt={
                          project.projectImage.altText || project.projectTitle
                        }
                        width={1100}
                        height={687}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  ) : (
                    <div className="w-full aspect-16/10 rounded-2xl border border-foreground/15 bg-surface/30" />
                  )}
                </div>

                {/* Project Details */}
                <div
                  className={`lg:col-span-6 flex flex-col gap-4 sm:gap-5 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {/* Tech Tags */}
                  {project.stack && project.stack.length > 0 && (
                    <ul
                      className="flex flex-wrap gap-2"
                      aria-label="Project technologies"
                    >
                      {project.stack.map((tag) => (
                        <li
                          key={tag._id}
                          className="rounded-full border border-foreground/15 bg-surface/60 px-3 py-0.5 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {tag.label}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Title */}
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-foreground text-balance">
                    {project.slug ? (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="link-hover-underline"
                      >
                        {project.projectTitle}
                      </Link>
                    ) : (
                      project.projectTitle
                    )}
                  </h2>

                  {/* Description */}
                  {typeof project.projectDescription === "string" &&
                    project.projectDescription.trim() && (
                      <p className="font-sans text-sm sm:text-base font-normal leading-relaxed text-muted-foreground text-pretty">
                        {project.projectDescription}
                      </p>
                    )}

                  {/* Direct Action Links */}
                  <div className="flex flex-wrap items-center gap-5 pt-2">
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground hover:text-foreground/80 transition-colors"
                      >
                        <span className="link-hover-underline">
                          View Case Study
                        </span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    )}

                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span className="link-hover-underline">Live Site</span>
                        <span
                          aria-hidden="true"
                          className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span className="link-hover-underline">GitHub</span>
                        <span
                          aria-hidden="true"
                          className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
