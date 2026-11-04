import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-sanity/hooks", () => ({
  useDraftModeEnvironment: vi.fn(),
}));

import { useDraftModeEnvironment } from "next-sanity/hooks";
import { DisableDraftMode } from "./index";

describe("DisableDraftMode", () => {
  it("renders nothing when inside Sanity Presentation Tool iframe", () => {
    vi.mocked(useDraftModeEnvironment).mockReturnValue("presentation-iframe");

    const html = renderToStaticMarkup(<DisableDraftMode />);
    expect(html).toBe("");
  });

  it("renders nothing when inside Sanity Presentation Tool window", () => {
    vi.mocked(useDraftModeEnvironment).mockReturnValue("presentation-window");

    const html = renderToStaticMarkup(<DisableDraftMode />);
    expect(html).toBe("");
  });

  it("renders exit badge when outside of Presentation Tool (environment === 'live')", () => {
    vi.mocked(useDraftModeEnvironment).mockReturnValue("live");

    const html = renderToStaticMarkup(<DisableDraftMode />);
    expect(html).toContain("Preview Mode Active");
    expect(html).toContain('href="/api/draft-mode/disable"');
    expect(html).toContain("Exit");
  });

  it("renders exit badge when standalone with static draft mode (environment === 'static')", () => {
    vi.mocked(useDraftModeEnvironment).mockReturnValue("static");

    const html = renderToStaticMarkup(<DisableDraftMode />);
    expect(html).toContain("Preview Mode Active");
    expect(html).toContain("Exit");
  });

  it("renders exit badge when environment is unknown", () => {
    vi.mocked(useDraftModeEnvironment).mockReturnValue("unknown");

    const html = renderToStaticMarkup(<DisableDraftMode />);
    expect(html).toContain("Preview Mode Active");
  });
});
