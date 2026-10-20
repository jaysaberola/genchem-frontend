import { serverApiBaseUrl } from "@/lib/apiBaseUrl";

export type ParsedAnalyticsScript = {
  src?: string;
  inline?: string;
  id: string;
};

let installedSignature: string | null = null;

/** Standard GA4 gtag snippet (same shape as legacy theme pages). */
export function buildGtagSnippet(measurementId: string): string {
  const id = measurementId.trim();
  return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`;
}

export function parseGoogleAnalyticsSnippet(raw: string | null | undefined): ParsedAnalyticsScript[] {
  const html = (raw ?? "").trim();
  if (!html) return [];

  if (typeof document === "undefined") {
    const scripts: ParsedAnalyticsScript[] = [];
    const srcMatches = html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi);
    for (const match of srcMatches) {
      scripts.push({ src: match[1], id: `ga-src-${scripts.length}` });
    }
    const inlineMatches = html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of inlineMatches) {
      const inline = match[1]?.trim();
      if (inline) {
        scripts.push({ inline, id: `ga-inline-${scripts.length}` });
      }
    }
    return scripts;
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  const parsed: ParsedAnalyticsScript[] = [];
  template.content.querySelectorAll("script").forEach((oldScript, index) => {
    const src = oldScript.getAttribute("src") ?? undefined;
    const inline = oldScript.textContent?.trim() ?? undefined;
    if (!src && !inline) return;
    parsed.push({
      src,
      inline,
      id: src ? `ga-src-${index}` : `ga-inline-${index}`,
    });
  });
  return parsed;
}

/** Server-side: Website Settings snippet, with optional env fallback on the API. */
export async function fetchPublicGoogleAnalyticsSnippet(): Promise<string | null> {
  const base = serverApiBaseUrl();
  if (!base || base === "/api") return null;

  try {
    const res = await fetch(`${base}/website-settings`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { setting?: { google_analytics?: string | null } };
    const snippet = (data.setting?.google_analytics ?? "").trim();
    return snippet || null;
  } catch {
    return null;
  }
}

/** Inject script tags from the CMS Google Analytics snippet (admin Website Settings). */
export function installGoogleAnalyticsSnippet(raw: string | null | undefined): void {
  if (typeof document === "undefined") return;

  const html = (raw ?? "").trim();
  if (!html) return;

  if (installedSignature === html) return;
  installedSignature = html;

  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll("script").forEach((oldScript) => {
    const src = oldScript.getAttribute("src");
    if (src && document.querySelector(`script[src="${CSS.escape(src)}"]`)) {
      return;
    }

    const script = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) => {
      script.setAttribute(attr.name, attr.value);
    });
    if (oldScript.textContent) {
      script.text = oldScript.textContent;
    }
    document.head.appendChild(script);
  });
}
