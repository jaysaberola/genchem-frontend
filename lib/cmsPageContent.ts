import type { PublicPage } from "@/services/publicPageService";
import { fixCmsDroneVideos } from "@/lib/genchemMedia";
import { patchHomeTrustBar } from "@/lib/genchemTrustBar";
import { GENCHEM_PRODUCT_TABS } from "@/lib/genchemProductTabs";

export { patchHomeTrustBar } from "@/lib/genchemTrustBar";

export function resolvePageStyles(pageData: Pick<PublicPage, "styles" | "json">): string {
  const chunks: string[] = [];

  if (pageData.styles && typeof pageData.styles === "string" && pageData.styles.trim()) {
    chunks.push(pageData.styles.trim());
  }

  if (pageData.json && typeof pageData.json === "string") {
    try {
      const parsed = JSON.parse(pageData.json);
      if (parsed["gjs-css"] && typeof parsed["gjs-css"] === "string") {
        const gjsCss = parsed["gjs-css"].trim();
        if (gjsCss && !chunks.includes(gjsCss)) {
          chunks.push(gjsCss);
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return chunks.join("\n");
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

/** Mark home hero intro (#iz2p only) — overlay + white typography must not apply to Products/About Us shells. */
export function patchHomeIntroHero(html: string): string {
  if (!html.includes("about-us-low")) return html;

  // Strip mistaken hero class from any block that is not the home intro (#iz2p)
  let output = html.replace(
    /(<div\b(?![^>]*\bid=["']iz2p["'])[^>]*\bclass=")([^"]*)\bhome-intro-hero\b\s*([^"]*)(")/gi,
    "$1$2$3$4",
  );

  const addHeroClass = (match: string, pre: string, classes: string, post: string) => {
    if (classes.includes("home-intro-hero")) return match;
    return `${pre}${classes} home-intro-hero${post}`;
  };

  output = output.replace(
    /(<div\b[^>]*\bid=["']iz2p["'][^>]*\bclass=")([^"]*\babout-us-low\b[^"]*)(")/i,
    addHeroClass,
  );

  output = output.replace(
    /(<div\b[^>]*\bclass=")([^"]*\babout-us-low\b[^"]*)("[^>]*\bid=["']iz2p["'])/i,
    addHeroClass,
  );

  return output;
}

/** Rename legacy #tab-1 / #tab-2 to named slugs (#pvc-resins / #pvc-stabilizers). */
export function patchProductsPageHtml(html: string): string {
  if (!html.includes("products-tabbings") && !html.includes('id="tab-1"') && !html.includes('id="pvc-resins"')) {
    return html;
  }

  let output = html;

  for (const tab of GENCHEM_PRODUCT_TABS) {
    const legacyId = `tab-${tab.index}`;
    output = output.replaceAll(`data-bs-target="#${legacyId}"`, `data-bs-target="#${tab.slug}"`);
    output = output.replaceAll(`href="/public/products#${legacyId}"`, `href="/public/products#${tab.slug}"`);
    output = output.replaceAll(`href="products.html#${legacyId}"`, `href="/public/products#${tab.slug}"`);

    if (output.includes(`id="${legacyId}"`)) {
      output = output.replaceAll(`id="${legacyId}"`, `id="${tab.slug}" data-genchem-tab="${tab.slug}"`);
    }

    if (!output.includes(`data-genchem-tab="${tab.slug}"`)) {
      output = output.replaceAll(
        `id="canvas-tab-${tab.index}"`,
        `id="canvas-tab-${tab.index}" data-genchem-tab="${tab.slug}"`,
      );
    }
  }

  output = output.replace(
    /class="(rounded-lg py-[45] px-3 border-2-white position-relative)/g,
    'class="width-img-control $1',
  );
  output = output.replace(/width-img-control width-img-control/g, "width-img-control");

  return output;
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

export function patchCmsStyles(css: string): string {
  if (!css.trim()) return "";

  return css
    .replace(/\.about-us-low::before\s*\{[^}]*\}/g, "")
    .replace(/background-color:\s*#d9d9d9/gi, "background-color: #ffffff")
    .replace(
      /\.about-us-high\s*\{\s*position:\s*relative;\s*z-index:\s*2;\s*color:\s*white;\s*\}/gi,
      '.about-us-low[style*="background-image"] .about-us-high { position: relative; z-index: 2; color: white; }',
    )
    .concat(
      '\n.about-us-low[style*="background-image"]::before { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.68); }',
      "\n.about-us-page .about-us-low:not([style*=\"background-image\"]):not(.home-intro-hero):not(#iz2p)::before { display: none !important; background: none !important; }",
      "\n.about-us-page .about-us-high { color: inherit; }",
      "\n.about-us-page .width-img-control .about-us-high .text-dark, .about-us-page .width-img-control .text-dark { color: #333333 !important; }",
    );
}

export function resolvePagePresentation(
  pageData: Pick<PublicPage, "content" | "json" | "styles">,
): { htmlContent: string; css: string } {
  const { html, css: embeddedCss } = extractEmbeddedStyles(resolvePageRawHtml(pageData));
  const css = patchCmsStyles([resolvePageStyles(pageData), embeddedCss].filter(Boolean).join("\n"));
  const htmlContent = rewriteCmsAssetUrls(
    fixCmsDroneVideos(
      sanitizeCmsPageContent(patchProductsPageHtml(patchHomeTrustBar(patchHomeIntroHero(html)))),
    ),
  );

  return { htmlContent, css };
}

/** Footer page styles — strip home-only rules from shared seeder CSS; scope to footer shell. */
/** Normalize footer HTML from CMS/GrapesJS to match genchemph reference. */
export function patchFooterHtml(html: string): string {
  if (!html.includes('id="footer"')) return html;

  let output = html;

  // Fix corrupted GrapesJS markup only — preserve user classes/styles on #copyrights
  output = output.replace(/<div\s+id="copyrights"\s*="[^"]*"[^>]*>/gi, '<div id="copyrights" class="p-0">');

  output = output.replace(/<iframe\b([^>]*)>/gi, (tag, attrs: string) => {
    if (/max-width\s*:/i.test(attrs)) return tag;
    const styleMatch = attrs.match(/\bstyle=(["'])([\s\S]*?)\1/i);
    if (styleMatch) {
      const merged = `${styleMatch[2].replace(/;\s*$/, "")}; max-width: 500px; max-height: 300px; border: 0;`;
      return tag.replace(styleMatch[0], `style="${merged}"`);
    }
    return `<iframe${attrs} style="max-width: 500px; max-height: 300px; border: 0;">`;
  });

  output = output.replace(
    /(<img\b[^>]*\balt=["']contact genchem ph["'][^>]*)(>)/gi,
    (tag, start: string, end: string) => {
      if (/\bstyle=/i.test(start)) {
        return tag.replace(/\bstyle=(["'])([\s\S]*?)\1/i, (_, q, s) => {
          const merged = s.includes("width") ? s : `${s.replace(/;\s*$/, "")}; width: 30px;`;
          return `style=${q}${merged}${q}`;
        });
      }
      return `${start} style="width: 30px;"${end}`;
    },
  );

  if (output.includes("footer-widgets-wrap")) {
    output = output.replace(
      /class="([^"]*\bcol-lg-4\b[^"]*\bbg-white\b[^"]*)"/gi,
      (match, cls) => (/\bpx-4\b/.test(cls) ? match : `class="${cls.trim()} px-4"`),
    );

    output = output.replace(
      /(<div class="col-lg-8 bg-dark-red">\s*<div class="row)(?![^"]*\bpx-5\b)/gi,
      '$1 px-5 py-5',
    );

    output = output.replace(
      /(<div class="col-12 col-lg-5)(?![^"]*\bpy-2\b)/gi,
      '$1 py-2',
    );

    output = output.replace(
      /(<div class="col-lg-4[^"]*">\s*<div class="widget)(?![^"]*\bpt-3\b)/gi,
      '$1 pt-3 pb-6',
    );
  }

  return output;
}

function scopeFooterSelectors(selectorList: string): string {
  return selectorList
    .split(",")
    .map((part) => {
      const selector = part.trim();
      if (!selector) return selector;
      if (selector.includes(".cms-footer-content") || selector.includes(".genchemph-canvas")) {
        return selector;
      }
      return `.cms-footer-content ${selector}, .genchemph-canvas ${selector}`;
    })
    .join(", ");
}

export function patchFooterStyles(css: string): string {
  if (!css.trim()) return "";

  let output = css
    .replace(/\* \{\s*box-sizing:[^}]+\}/g, "")
    .replace(/body \{\s*margin:\s*0;?\s*\}/g, "")
    .replace(/\.about-us-low[\s\S]*?\}/g, "")
    .replace(/\.about-us-high[\s\S]*?\}/g, "")
    .replace(/#demo-drone-tab[\s\S]*?\}/g, "")
    .replace(/\.genchemph \.nav-tabs[\s\S]*?\}/g, "")
    .replace(/\.hover-scale[\s\S]*?\}/g, "")
    .replace(/\.floating-logo[\s\S]*?\}/g, "")
    .replace(/#logo\.gemchem-logo[\s\S]*?\}/g, "")
    .replace(/div#top-call[\s\S]*?\}/g, "")
    .replace(/\.about-us-page[\s\S]*?\}/g, "")
    .replace(/undefined:undefined;?/g, "")
    .trim();

  output = output.replace(/(^|})([^{}]+)\{/g, (match, prefix, selectorPart) => {
    const selector = selectorPart.trim();
    if (!selector || selector.startsWith("@")) return match;
    return `${prefix}${scopeFooterSelectors(selector)}{`;
  });

  return output;
}

export function resolveFooterPresentation(
  pageData: Pick<PublicPage, "content" | "json" | "styles">,
): { htmlContent: string; css: string } {
  const { html, css: embeddedCss } = extractEmbeddedStyles(resolvePageRawHtml(pageData));
  const css = patchFooterStyles([resolvePageStyles(pageData), embeddedCss].filter(Boolean).join("\n"));
  const htmlContent = rewriteCmsAssetUrls(
    sanitizeCmsPageContent(patchFooterHtml(html)),
  );

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
  output = output.replace(/<!--[\s\S]*?floating logo[\s\S]*?-->/gi, "");
  output = output.replace(
    /<div\s+class="floating-logo"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi,
    ""
  );
  return output.trim();
}

export function rewriteCmsAssetUrls(html: string): string {
  if (!html) return html;

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const frontendBase = (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

  let output = html;

  // Normalize legacy absolute frontend URLs from older seeder runs
  output = output.replace(
    new RegExp(`src="${frontendBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/images/genchemph/`, "g"),
    'src="/images/genchemph/',
  );
  output = output.replace(
    new RegExp(`url\\(${frontendBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/images/genchemph/`, "g"),
    "url(/images/genchemph/",
  );

  if (apiBase) {
    output = output
      .replace(/src="images\//g, `src="${apiBase}/theme/addons/images/`)
      .replace(/src='images\//g, `src='${apiBase}/theme/addons/images/`)
      .replace(/url\(['"]?images\//g, `url(${apiBase}/theme/addons/images/`);
  }

  output = output
    .replace(/src="\/images\/genchemph\//g, 'src="/images/genchemph/')
    .replace(/src='\/images\/genchemph\//g, "src='/images/genchemph/")
    .replace(/src='images\//g, "src='/images/genchemph/")
    .replace(/src="images\/video\.mp4"/g, 'src="/images/genchemph/video.mp4"')
    .replace(/src='images\/video\.mp4'/g, "src='/images/genchemph/video.mp4'");

  return output;
}
