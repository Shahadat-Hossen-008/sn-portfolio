import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await draftMode()).disable();

  const cookieStore = await cookies();
  cookieStore.delete("__sanity_preview_perspective");

  const url = new URL(request.url);
  const redirectParam = url.searchParams.get("redirect");
  const referer = request.headers.get("referer");

  let targetPath = "/";
  if (
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
  ) {
    targetPath = redirectParam;
  } else if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.origin === url.origin) {
        targetPath = refererUrl.pathname + refererUrl.search;
      }
    } catch {
      // Fallback to "/" if referer parsing fails
    }
  }

  return NextResponse.redirect(new URL(targetPath, request.url));
}
