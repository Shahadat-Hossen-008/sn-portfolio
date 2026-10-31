import "@/app/globals.css";
import { fraunces, jetBrainsMono, urbanist } from "@/app/fonts";

/**
 * Root shell for the whole app, including `/studio`.
 *
 * Metadata deliberately lives in `src/app/(frontend)/layout.tsx` instead: it is
 * built from the `siteSettings` singleton, and this layout also wraps the
 * Studio route, which must not depend on portfolio content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${urbanist.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
