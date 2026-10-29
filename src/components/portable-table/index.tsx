import { PortableText } from "next-sanity";
import { inlinePortableTextComponents } from "@/components/portable-text/sub-components/inline-components";
import type { IPortableTableProps } from "./interface";

/**
 * Semantic editorial table with monospace uppercase column headers,
 * horizontal hairline row dividers, hover surface highlighting, and
 * inline Portable Text cells.
 */
export function PortableTable({
  caption,
  columnHeaders,
  rows,
}: IPortableTableProps) {
  if (!columnHeaders?.length || !rows?.length) {
    return null;
  }

  return (
    <figure className="my-8 overflow-x-auto border border-border bg-background">
      {caption?.trim() && (
        <figcaption className="border-b border-border bg-surface px-4 py-2.5 font-mono text-label uppercase text-muted-foreground">
          {caption.trim()}
        </figcaption>
      )}
      <table className="w-full min-w-xl border-collapse text-[0.95rem]">
        <thead>
          <tr>
            {columnHeaders.map((header, i) => (
              <th
                key={header._key || i}
                scope="col"
                className="border-b border-border bg-surface/60 px-4 py-3.5 text-left align-bottom font-mono text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row._key || ri} className="group">
              {row.cells?.map((cell, ci) => (
                <td
                  key={cell._key || ci}
                  className="border-b border-border/40 px-4 py-3.5 align-top leading-[1.6] text-muted-foreground transition-colors group-hover:bg-surface group-last:border-b-0"
                >
                  {cell.content && cell.content.length > 0 && (
                    <PortableText
                      value={cell.content}
                      components={inlinePortableTextComponents}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default PortableTable;
