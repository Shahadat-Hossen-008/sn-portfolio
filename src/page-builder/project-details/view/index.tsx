import Link from "next/link";
import { toPlainText } from "@portabletext/react";
import { PortableText } from "next-sanity";
import { SanityImage } from "@/components/image";
import { createPortableTextComponents } from "@/components/portable-text";
import { formatPeriod } from "@/sections/shared/section-formatting";
import type { IProjectDetailsProps } from "./interface";

function cleanText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(value) && value.length > 0) {
    try {
      const text = toPlainText(value).trim();
      return text.length > 0 ? text : null;
    } catch {
      return null;
    }
  }
  return null;
}

export interface IProjectMetaItem {
  label: string;
  value: string;
}

/**
 * Pure declarative resolver for project metadata strip items.
 * Extracts first-class semantic fields without mutations:
 * - ROLE: `project.role`
 * - DURATION: `project.duration` or formatted `start`–`end` timeline
 * - PLATFORM: `project.projectType`
 * - CLIENT: `project.client` (optional; rendered only when provided, zero fallback)
 */
export function resolveProjectMetadata(
  project: IProjectDetailsProps["project"],
): IProjectMetaItem[] {
  const role = cleanText(project.role);
  const duration =
    cleanText(project.duration) ||
    (project.start ? formatPeriod(project.start, project.end) : null);
  const platform = cleanText(project.projectType);
  const client = cleanText(project.client);

  return [
    role ? { label: "ROLE", value: role } : null,
    duration ? { label: "DURATION", value: duration } : null,
    platform ? { label: "PLATFORM", value: platform } : null,
    client ? { label: "CLIENT", value: client } : null,
  ].filter((item): item is IProjectMetaItem => item !== null);
}

export function ProjectDetailsView({ project }: IProjectDetailsProps) {
  const description = cleanText(project.projectDescription);
  const metadataItems = resolveProjectMetadata(project);

  return (
    <article className="bg-background text-foreground pb-24 sm:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 pt-12 sm:pt-16 lg:pt-20">
        {/* Back Link */}
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          <span className="link-hover-underline">Back to Projects</span>
        </Link>

        {/* Tech Stack Pills at Top */}
        {project.stack && project.stack.length > 0 && (
          <ul
            className="flex flex-wrap gap-2 mb-6"
            aria-label="Project technologies"
          >
            {project.stack.map((tag) => (
              <li
                key={tag._id}
                className="rounded-full border border-foreground/15 bg-surface px-3 py-1 font-sans text-xs font-semibold tracking-wider uppercase text-muted-foreground"
              >
                {tag.label}
              </li>
            ))}
          </ul>
        )}

        {/* Project Title */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-balance text-foreground leading-[1.08] tracking-tight max-w-4xl">
          {project.projectTitle}
        </h1>

        {/* Lead Narrative Description */}
        {description && (
          <p className="mt-5 font-sans text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl text-pretty">
            {description}
          </p>
        )}

        {/* Action Links */}
        {(project.liveLink || project.githubUrl) && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:shadow-md"
              >
                <span>Live Site</span>
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
                className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-surface px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-foreground/5 hover:border-foreground/30 transition-all duration-200"
              >
                <span>Source Code</span>
                <span
                  aria-hidden="true"
                  className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            )}
          </div>
        )}

        {/* Featured Hero Mockup*/}
        {project.projectImage?.imageFile && (
          <div className="mt-10 sm:mt-14 w-full rounded-2xl overflow-hidden border border-foreground/15 bg-surface/50 shadow-sm">
            <SanityImage
              image={project.projectImage.imageFile}
              alt={project.projectImage.altText || project.projectTitle}
              width={1600}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Flexible 4-Column Metadata Strip */}
        {metadataItems.length > 0 && (
          <div className="mt-12 sm:mt-16 border-y border-foreground/15 py-8">
            <div
              className={`grid gap-6 sm:gap-8 ${
                metadataItems.length >= 4
                  ? "grid-cols-2 md:grid-cols-4"
                  : metadataItems.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-2"
              }`}
            >
              {metadataItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1.5 items-center"
                >
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-sans text-sm sm:text-base font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Study Body: Single-column container allowing rich text 2-column editorial blocks to render cleanly */}
        {project.caseStudy && project.caseStudy.length > 0 && (
          <section
            aria-label="Case Study Narrative"
            className="mt-12 sm:mt-16 w-full"
          >
            <PortableText
              value={project.caseStudy}
              components={createPortableTextComponents(project.caseStudy)}
            />
          </section>
        )}
      </div>
    </article>
  );
}

export default ProjectDetailsView;
