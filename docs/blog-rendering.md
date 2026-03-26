# Blog Rendering Strategy

## 1. Rendering Type

Both blog routes are React Server Components because they are in the App Router and do not include `"use client"`.

- `src/app/(frontend)/blog/page.tsx`
- `src/app/(frontend)/blog/[slug]/page.tsx`

Data is fetched on the server using `sanityFetch` from `src/sanity/lib/live.ts`.

## 2. SSR vs Prefetch

Initial page rendering is server-side (RSC).

Route prefetch is client-side navigation optimization done by Next.js `Link` (default behavior), for example in `src/components/blogs/Blog.tsx` where links navigate to `/blog/[slug]`.

So this is not "server-side prefetch". It is client-triggered preloading of route data from the server.

## 3. Static vs On-demand Behavior

There is no `generateStaticParams` in `src/app/(frontend)/blog/[slug]/page.tsx`, so slug pages are not fully pre-generated from a known list at build time.

Content fetching uses `defineLive` and `SanityLive`:

- `src/sanity/lib/live.ts`
- `src/app/(frontend)/layout.tsx`

This enables automatic revalidation/refresh behavior for `sanityFetch` queries when content changes.

## 4. One-line Summary

Blog pages are server-rendered with Next.js Server Components, while link prefetch is client-side and only improves navigation speed.
