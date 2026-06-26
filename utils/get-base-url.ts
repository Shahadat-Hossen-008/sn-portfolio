import { IWorkspace } from "./type";

export function getBaseUrl(workspace: IWorkspace): string {
  switch (workspace) {
    case "development": {
      const url = process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_DEVELOP;
      if (!url) {
        throw new Error("SANITY_STUDIO_PREVIEW_URL_DEVELOP is not defined");
      }
      return url;
    }

    case "production": {
      const url = process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION;
      if (!url) {
        throw new Error("SANITY_STUDIO_PREVIEW_URL_PRODUCTION is not defined");
      }
      return url;
    }

    default: {
      const exhaustiveCheck: never = workspace;
      throw new Error(`Unhandled dataset: ${exhaustiveCheck}`);
    }
  }
}