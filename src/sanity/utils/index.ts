import { IWorkspace } from "./type";

const DEFAULT_FALLBACK_URL = "http://localhost:3000";

function getFallbackBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    return siteUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return DEFAULT_FALLBACK_URL;
}

export function getBaseUrl(workspace: IWorkspace): string {
  switch (workspace) {
    case "development": {
      const url =
        process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_DEVELOP?.trim();
      return url ? url.replace(/\/+$/, "") : getFallbackBaseUrl();
    }

    case "production": {
      const url =
        process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION?.trim();
      return url ? url.replace(/\/+$/, "") : getFallbackBaseUrl();
    }

    default: {
      return getFallbackBaseUrl();
    }
  }
}
