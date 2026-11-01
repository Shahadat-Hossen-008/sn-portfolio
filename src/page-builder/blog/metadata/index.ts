import type { Metadata } from "next";

import { buildPageMetadata } from "@/page-builder/shared/metadata";

export async function generateBlogMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/blog",
  });
}
