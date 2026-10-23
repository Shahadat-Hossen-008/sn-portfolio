import { GoogleTagManager } from "@/components/analytics";
import { Section } from "@/components/section";
import { SanityLive } from "@/sanity/lib/live";
import { FooterBuilder } from "./footer/builder";
import { HeaderBuilder } from "./header/builder";
import type { ILayoutBuilderProps } from "./interface";

export function LayoutBuilder({
  children,
  layout,
  siteSettings,
}: ILayoutBuilderProps) {
  return (
    <Section as="div" data-frontend-root className="font-sans">
      <HeaderBuilder layout={layout} />
      <main>{children}</main>
      <FooterBuilder layout={layout} />
      <GoogleTagManager id={siteSettings?.analytics?.googleTagManagerID} />
      <SanityLive />
    </Section>
  );
}

export default LayoutBuilder;
