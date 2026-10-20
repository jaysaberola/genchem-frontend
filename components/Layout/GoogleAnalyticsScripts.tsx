import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

import {
  buildGtagSnippet,
  parseGoogleAnalyticsSnippet,
} from "@/lib/googleAnalytics";
import { getWebsiteSettingsCached } from "@/lib/websiteSettings";

type GoogleAnalyticsScriptsProps = {
  /** Snippet from SSR (Website Settings). */
  snippet?: string | null;
};

/** Renders gtag at the end of public pages (legacy theme parity). */
export default function GoogleAnalyticsScripts({ snippet }: GoogleAnalyticsScriptsProps) {
  const [code, setCode] = useState(() => (snippet ?? "").trim());

  useEffect(() => {
    if (code) return;

    let alive = true;
    void (async () => {
      try {
        const settings = await getWebsiteSettingsCached({ force: true });
        const fromApi = (settings.google_analytics as string | undefined)?.trim() ?? "";
        if (!alive) return;
        if (fromApi) {
          setCode(fromApi);
          return;
        }
        const envId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
        if (envId) setCode(buildGtagSnippet(envId));
      } catch {
        // ignore
      }
    })();

    return () => {
      alive = false;
    };
  }, [code]);

  const scripts = useMemo(() => parseGoogleAnalyticsSnippet(code), [code]);
  if (!scripts.length) return null;

  return (
    <>
      {scripts.map((entry) =>
        entry.src ? (
          <Script key={entry.id} id={entry.id} src={entry.src} strategy="afterInteractive" />
        ) : (
          <Script key={entry.id} id={entry.id} strategy="afterInteractive">
            {entry.inline ?? ""}
          </Script>
        ),
      )}
    </>
  );
}
