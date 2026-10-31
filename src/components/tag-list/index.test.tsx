import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TagList } from "./index";

describe("TagList", () => {
  it("renders nothing when tags array is empty or undefined", () => {
    const htmlEmpty = renderToStaticMarkup(<TagList tags={[]} />);
    expect(htmlEmpty).toBe("");

    const htmlUndefined = renderToStaticMarkup(<TagList tags={undefined} />);
    expect(htmlUndefined).toBe("");
  });

  it("renders non-interactive chips with correct classes", () => {
    const tags = [
      { _id: "1", label: "React" },
      { _id: "2", label: "Next.js" },
    ];
    const html = renderToStaticMarkup(<TagList tags={tags} />);

    expect(html).toContain('<ul class="flex flex-wrap gap-2">');
    expect(html).toContain('<li class="inline-flex rounded-full border border-limestone-border px-3 py-1.5 text-base leading-[1.2] text-foreground">React</li>');
    expect(html).toContain('<li class="inline-flex rounded-full border border-limestone-border px-3 py-1.5 text-base leading-[1.2] text-foreground">Next.js</li>');
  });
});
