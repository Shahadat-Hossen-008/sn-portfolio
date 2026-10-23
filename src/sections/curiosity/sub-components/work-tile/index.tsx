import Link from "next/link";
import { Button } from "@/components/button";
import { isExternalHref, resolveLink } from "@/sanity/lib/links";
import type { CuriosityProjectRow } from "@/sanity/lib/curiosity";
import { Tile } from "../tile";
import type { IWorkTileProps } from "./interface";

export function WorkTile({
  work,
  projects,
  rise,
  layout,
}: IWorkTileProps) {
  const cta = work?.cta;
  const href = cta?.isDisabled ? null : resolveLink(cta);
  const label = cta?.label?.trim();
  const showCta = Boolean(href && label);
  if (!showCta && !projects.length) return null;
  const className =
    layout === "designed"
      ? "bento:col-start-6 bento:col-end-13 bento:row-start-3"
      : "bento:col-span-6";

  return (
    <Tile
      tone="cta"
      labelledBy="curiosity-work-title"
      className={className}
      rise={rise}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <p className="lab font-mono text-label uppercase text-muted-sage">
          Projects
        </p>
        <h3
          id="curiosity-work-title"
          className="font-display text-title font-normal"
        >
          {work?.title?.trim() || "The work lives on its own pages."}
        </h3>
        {showCta && (
          <div className="mt-auto self-start">
            <Button
              href={href!}
              variant="mint"
              external={cta?.openInNewTab === true}
            >
              {label}
              <span
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              >
                →
              </span>
            </Button>
          </div>
        )}
      </div>
      {projects.length > 0 && (
        <ul
          aria-label="Latest projects"
          className="flex w-auto flex-none flex-col gap-2 self-center bento:w-75"
        >
          {projects.map((project) => {
            const external = project.href
              ? isExternalHref(project.href)
              : false;
            const row = (
              <ProjectRow project={project} linked={Boolean(project.href)} />
            );
            return (
              <li key={project._id}>
                {project.href ? (
                  external ? (
                    <a
                      href={project.href}
                      target={project.openInNewTab ? "_blank" : undefined}
                      rel={
                        project.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      className="group flex items-center justify-between gap-3 rounded-row border border-limestone/16 bg-soft-forest py-2.5 pl-3.5 pr-3 no-underline hover:border-mint/55 focus-visible:outline-2 focus-visible:outline-mint focus-visible:outline-offset-3"
                    >
                      {row}
                      <ProjectArrow />
                    </a>
                  ) : (
                    <Link
                      href={project.href}
                      target={project.openInNewTab ? "_blank" : undefined}
                      rel={
                        project.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      className="group flex items-center justify-between gap-3 rounded-row border border-limestone/16 bg-soft-forest py-2.5 pl-3.5 pr-3 no-underline hover:border-mint/55 focus-visible:outline-2 focus-visible:outline-mint focus-visible:outline-offset-3"
                    >
                      {row}
                      <ProjectArrow />
                    </Link>
                  )
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-row border border-limestone/16 bg-soft-forest py-2.5 pl-3.5 pr-3">
                    <ProjectRow project={project} linked={false} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Tile>
  );
}

function ProjectRow({
  project,
  linked,
}: {
  project: CuriosityProjectRow;
  linked: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="truncate font-sans text-base font-semibold leading-[1.3] text-limestone">
        {project.title}
      </span>
      {project.technologies.length > 0 && (
        <span className="truncate font-mono text-label tracking-[0.04em] text-muted-sage">
          {project.technologies.join(" · ")}
        </span>
      )}
      {linked && <span className="sr-only">Open project</span>}
    </span>
  );
}

function ProjectArrow() {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 shrink-0 translate-x-0 place-items-center rounded-full border border-limestone/30 text-sm text-muted-sage motion-safe:transition motion-safe:group-hover:translate-x-0.5 group-hover:border-mint group-hover:bg-mint group-hover:text-forest"
    >
      →
    </span>
  );
}

export default WorkTile;
