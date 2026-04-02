# Image Component Comparison: Sanity `<picture>/<img>` vs Next.js `<Image />`

This README compares two ways to render **Sanity-hosted images** in a Next.js project:

1. **`SanityImage`** — uses native HTML (`<picture>` + `<img>`) and optimizes images via **Sanity CDN URL transforms** (`width`, `height`, `quality`, `auto("format")`, etc.).
2. **`SanityNextImage`** — uses **Next.js `next/image`** which provides built-in responsive `srcset`, lazy-loading, and layout stability (when configured for remote images).

---

## Preview (DevTools evidence)

Below screenshots show the difference in the final downloaded resource:

| Sanity `<picture>/<img>`                                             | Next.js `<Image />`                                            |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| ![SanityImage result](/src/components/image/imageTagPerformance.png) | ![SanityNextImage result](/src/components/image/nextImage.png) |

What the screenshots indicate:

- **SanityImage** loads directly from `cdn.sanity.io` with Sanity params (example: `w=400&h=500&q=80&auto=format`).
- **SanityNextImage** loads through Next’s optimizer route. (`/_next/image?...`) and may produce a different final size/quality depending on Next config.

> Note: Exact results vary based on your chosen sizes, `quality`, device DPR, `sizes`, and Next.js configuration.

---

## Key differences (professional summary)

| Area                       | `SanityImage` (`<picture>/<img>`)                   | `SanityNextImage` (`next/image`)                             |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| Optimization engine        | Sanity Image CDN (URL transforms)                   | Next.js Image Optimization (plus optional Sanity transforms) |
| Modern formats (AVIF/WebP) | ✅ Possible, but you must request formats correctly | ✅ Possible, depends on Next config + optimization path      |
| Responsive `srcset`        | ⚠️ Manual (you must build `srcset` + `sizes`)       | ✅ Built-in (auto `srcset` and sizing behavior)              |
| Lazy loading               | ⚠️ Manual (`loading="lazy"`)                        | ✅ Built-in by default (unless eager/priority)               |
| Layout stability (CLS)     | ✅ If `width` + `height` are correct                | ✅ If `width` + `height` or `fill` is used correctly         |
| Best for                   | Maximum control & simple HTML                       | Automatic responsiveness and performance defaults            |

---

## References (what readers can learn more from)

- Next.js official docs — Image Optimization:  
  https://nextjs.org/docs/app/building-your-application/optimizing/images

- Sanity official docs — Image URL builder (Sanity Image CDN):  
  https://www.sanity.io/docs/image-url

---

## When should I use which?

- If you want **manual control + simple HTML** → use `<picture>/<img>`
- If you want **built-in responsive behavior and lazy loading** → use `next/image`

### Implementation-ready snippets (recommended to add)

- “Best `<picture>` implementation”
- “Best `next/image` implementation”
- “Responsive `srcset` helper” (optional)
