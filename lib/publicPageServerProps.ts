import type { PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
import { formatCmsCssForViewSource, formatCmsHtmlForViewSource } from "@/lib/formatCmsMarkup";

export type PublicPageShell = Pick<
  PublicPage,
  "id" | "title" | "label" | "slug" | "image_url" | "meta" | "album"
>;

export function toPublicPageShell(page: PublicPage): PublicPageShell {
  return {
    id: page.id,
    title: page.title,
    label: page.label,
    slug: page.slug,
    image_url: page.image_url,
    meta: page.meta,
    album: page.album,
  };
}

/** Keeps heavy CMS markup out of duplicated `pageData` in __NEXT_DATA__. */
export function buildSlimPublicPageProps(
  pageData: PublicPage,
  extra: Record<string, unknown> = {},
) {
  const { htmlContent, css } = resolvePagePresentation(pageData);

  return {
    pageShell: toPublicPageShell(pageData),
    cmsHtml: formatCmsHtmlForViewSource(htmlContent),
    cmsCss: formatCmsCssForViewSource(css),
    ...extra,
  };
}
