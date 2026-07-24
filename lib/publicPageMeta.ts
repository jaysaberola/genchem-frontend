import type { PublicPage } from "@/services/publicPageService";

export type PublicPageMetaSource = Pick<PublicPage, "meta" | "label" | "title" | "slug">;

const DEFAULT_SITE_TITLE = "GenChem PH";

function normalizeMetaText(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function titleFromSlug(slug?: string): string | undefined {
  if (!slug) return undefined;

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** SEO title → page label → page title → slug. */
export function getPublicPageDocumentTitle(
  page?: PublicPageMetaSource | null,
): string {
  if (!page) return DEFAULT_SITE_TITLE;

  return (
    normalizeMetaText(page.meta?.title) ??
    normalizeMetaText(page.label) ??
    normalizeMetaText(page.title) ??
    titleFromSlug(page.slug) ??
    DEFAULT_SITE_TITLE
  );
}

export function getPublicPageMetaDescription(
  page?: PublicPageMetaSource | null,
): string | undefined {
  return normalizeMetaText(page?.meta?.description);
}

export function getPublicPageMetaKeywords(
  page?: PublicPageMetaSource | null,
): string | undefined {
  return normalizeMetaText(page?.meta?.keywords);
}
