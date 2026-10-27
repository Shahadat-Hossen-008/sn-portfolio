import { defineQuery } from "next-sanity";

import { ABOUT_PAGE_FRAGMENT } from "./fragment";

/** Singleton About page query, including the page-owned opening and sections. */
export const ABOUT_PAGE_QUERY = defineQuery(
  `*[_type == "aboutPage"][0]${ABOUT_PAGE_FRAGMENT}`,
);
