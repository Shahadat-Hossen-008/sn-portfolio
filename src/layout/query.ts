import { defineQuery } from "next-sanity";
import { FOOTER_FRAGMENT } from "./footer/builder/fragment";
import { HEADER_FRAGMENT } from "./header/builder/fragment";

/**
 * Singleton layout (`layout`).
 *
 * Returns `null` until the document has been created in the Studio, which is a
 * supported state: the navbar and footer render nothing in that state. Every
 * consumer must null-check.
 */
export const LAYOUT_QUERY = defineQuery(`*[_type == "layout"][0]{
  identity {
    siteTitle,
    siteDescription,
    logo {
      imageFile {
        asset->{_id, url, metadata{dimensions{width, height}}}
      },
      altText
    },
    favicon {
      asset->{_id, url, metadata{dimensions{width, height}}}
    },
    socialLinks[]{
      network,
      label,
      url
    }
  },
  ${HEADER_FRAGMENT},
  ${FOOTER_FRAGMENT}
}`);

/**
 * Site-wide settings singleton (`siteSettings`).
 *
 * Returns `null` until the document has been created in the Studio, which is a
 * supported state: SEO falls back to built-in defaults and analytics is not
 * loaded. Every consumer must null-check.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  seo {
    titleTemplate,
    defaultOgImage {
      imageFile {
        asset->{_id, url, metadata{dimensions{width, height}}}
      },
      altText
    },
    robots {
      disableIndex,
      disableFollow,
      disableImageIndex,
      disableSnippet
    }
  },
  analytics {
    googleTagManagerID
  }
}`);
