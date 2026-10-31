import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { GoogleTagManager } from "@/components/analytics";

/**
 * Gate: "Verify invalid or absent GTM IDs do not load the script."
 *
 * Rendered with `renderToStaticMarkup` so the assertion is against the actual
 * markup a request would produce, not against the validator alone.
 */
describe("GoogleTagManager", () => {
  it.each([null, undefined, "", "   ", "gtm-abc", "UA-1", "GTM-<script>"])(
    "renders nothing for %o",
    (id) => {
      const html = renderToStaticMarkup(<GoogleTagManager id={id} />);

      expect(html).toBe("");
      expect(html).not.toContain("googletagmanager.com");
    },
  );

  it("renders the container for a valid id", () => {
    const html = renderToStaticMarkup(<GoogleTagManager id="GTM-ABC123" />);

    expect(html).toContain("GTM-ABC123");
    expect(html).toContain("googletagmanager.com/ns.html?id=GTM-ABC123");
  });
});