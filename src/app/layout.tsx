import "@/app/globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}