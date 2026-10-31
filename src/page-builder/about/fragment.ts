import { PAGE_INTRO_FRAGMENT } from '@/sections/page-intro/builder/fragment';
import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** About-page projection: its page-owned intro and ordered reusable sections. */
export const ABOUT_PAGE_FRAGMENT = /* groq */ `{
  ${SEO_FIELDS_FRAGMENT},
  ${PAGE_INTRO_FRAGMENT},
  ${PAGE_SECTIONS_FRAGMENT}
}`;
