import { useEffect } from "react";

import { installGoogleAnalyticsSnippet } from "@/lib/googleAnalytics";
import {
  getWebsiteSettingsCached,
  subscribeWebsiteSettingsUpdated,
} from "@/lib/websiteSettings";

/** Loads Google Analytics from Website Settings on public pages. */
export default function WebsiteAnalyticsHead() {
  useEffect(() => {
    let alive = true;

    const refresh = async (opts?: { force?: boolean }) => {
      try {
        const settings = await getWebsiteSettingsCached({ force: opts?.force === true });
        if (!alive) return;
        installGoogleAnalyticsSnippet(settings.google_analytics as string | undefined);
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

  return null;
}
