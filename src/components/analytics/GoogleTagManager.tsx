import Script from "next/script";

import { getGtmContainerId } from "@/sanity/lib/analytics";

type GoogleTagManagerProps = {
  /** Raw CMS value; validated again here, never trusted from the Studio alone. */
  id: string | null | undefined;
};

/**
 * Google Tag Manager.
 *
 * Renders nothing unless the id matches `^GTM-[A-Z0-9]+$`, so a half-typed or
 * hand-edited value can never produce a `<script src>` we do not control.
 *
 * Consent: this repository has no consent-management layer, so the container
 * loads on every page view as soon as an id is configured. If a banner is added
 * later, gate the `afterInteractive` script (or move it to
 * `Script strategy="lazyOnload"` once consent is granted) in this single
 * component rather than at the call site.
 */
export default function GoogleTagManager({ id }: GoogleTagManagerProps) {
  const containerId = getGtmContainerId(id);

  if (!containerId) return null;

  return (
    <>
      <Script
        id="gtm-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;var n=d.querySelector('[nonce]');if(n){j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'));}f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}