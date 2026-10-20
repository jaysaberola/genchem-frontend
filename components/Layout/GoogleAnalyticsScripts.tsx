import Script from "next/script";

import { parseGoogleAnalyticsSnippet } from "@/lib/googleAnalytics";

type Props = {
  snippet?: string | null;
};

export default function GoogleAnalyticsScripts({ snippet }: Props) {
  const scripts = parseGoogleAnalyticsSnippet(snippet);
  if (!scripts.length) return null;

  return (
    <>
      {scripts.map((entry) => {
        if (entry.src) {
          return (
            <Script
              key={entry.id}
              id={entry.id}
              src={entry.src}
              strategy="afterInteractive"
            />
          );
        }
        if (entry.inline) {
          return (
            <Script key={entry.id} id={entry.id} strategy="afterInteractive">
              {entry.inline}
            </Script>
          );
        }
        return null;
      })}
    </>
  );
}
