import { useEffect, useState } from "react";
import Head from "next/head";

import {
  getWebsiteSettingsCached,
  resolveHeaderFaviconUrl,
  subscribeWebsiteSettingsUpdated,
} from "@/lib/websiteSettings";

export default function WebsiteFaviconHead() {
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>();

  useEffect(() => {
    let alive = true;

    const refresh = async (opts?: { force?: boolean }) => {
      try {
        const settings = await getWebsiteSettingsCached({ force: opts?.force === true });
        if (!alive) return;
        setFaviconUrl(resolveHeaderFaviconUrl(settings));
      } catch {
        // ignore
      }
    };

    refresh({ force: true });
    const unsub = subscribeWebsiteSettingsUpdated(() => refresh({ force: true }));

    return () => {
      alive = false;
      unsub();
    };
  }, []);

  if (!faviconUrl) return null;

  return (
    <Head>
      <link rel="icon" href={faviconUrl} type="image/x-icon" />
      <link rel="shortcut icon" href={faviconUrl} type="image/x-icon" />
    </Head>
  );
}
