import type { PublicPage } from "@/services/publicPageService";

export function resolvePageStyles(pageData: Pick<PublicPage, "styles" | "json">): string {
  if (pageData.styles && typeof pageData.styles === "string" && pageData.styles.trim()) {
    return pageData.styles.trim();
  }

  if (pageData.json && typeof pageData.json === "string") {
    try {
      const parsed = JSON.parse(pageData.json);
      if (parsed["gjs-css"] && typeof parsed["gjs-css"] === "string") {
        return parsed["gjs-css"].trim();
      }
    } catch {
      // ignore parse errors
    }
  }

  return "";
}

function resolvePageRawHtml(pageData: Pick<PublicPage, "content" | "json">): string {
  if (pageData.content && typeof pageData.content === "string" && pageData.content.trim()) {
    return pageData.content.trim();
  }

  if (pageData.json && typeof pageData.json === "string") {
    try {
      const parsed = JSON.parse(pageData.json);
      if (parsed["gjs-html"] && typeof parsed["gjs-html"] === "string") {
        return parsed["gjs-html"].trim();
      }
    } catch {
      // ignore
    }
  }

  return "";
}

export function resolvePageContent(pageData: Pick<PublicPage, "content" | "json">): string {
  return sanitizeCmsPageContent(resolvePageRawHtml(pageData));
}

/** Pull embedded `<style>` blocks out of CMS HTML (GrapesJS often inlines them). */
export function extractEmbeddedStyles(html: string): { html: string; css: string } {
  if (!html) return { html: "", css: "" };

  const cssChunks: string[] = [];
  const stripped = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, css: string) => {
    if (css.trim()) cssChunks.push(css.trim());
    return "";
  });

  return { html: stripped.trim(), css: cssChunks.join("\n") };
}

export function resolvePagePresentation(
  pageData: Pick<PublicPage, "content" | "json" | "styles">,
): { htmlContent: string; css: string } {
  const { html, css: embeddedCss } = extractEmbeddedStyles(resolvePageRawHtml(pageData));
  const css = [resolvePageStyles(pageData), embeddedCss].filter(Boolean).join("\n");
  const htmlContent = rewriteCmsAssetUrls(sanitizeCmsPageContent(html));

  return { htmlContent, css };
}

/** Remove duplicate header/hero blocks — the React layout already renders those. */
export function sanitizeCmsPageContent(html: string): string {
  if (!html) return "";

  let output = html;
  output = output.replace(/<header[\s\S]*?<\/header>/gi, "");
  output = output.replace(
    /<section[^>]*class="[^"]*slider-element[^"]*"[\s\S]*?<\/section>/gi,
    ""
  );
  return output.trim();
}

export function rewriteCmsAssetUrls(html: string): string {
  if (!html) return html;

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (!apiBase) return html;

  return html
    .replace(/src="images\//g, `src="${apiBase}/theme/addons/images/`)
    .replace(/src='images\//g, `src='${apiBase}/theme/addons/images/`)
    .replace(/url\(['"]?images\//g, `url(${apiBase}/theme/addons/images/`);
}
