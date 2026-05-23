// src/components/Analytics.tsx
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function GA4Script() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

export default function Analytics() {
  return (
    <GA4Script />
  );
}
