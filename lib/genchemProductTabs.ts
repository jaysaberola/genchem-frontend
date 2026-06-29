/** Named product tabs — used in URLs, menu links, and CMS tab panes. */
export const GENCHEM_PRODUCT_TABS = [
  { slug: "pvc-resins", label: "PVC Resins", index: 1 },
  { slug: "pvc-stabilizers", label: "PVC Stabilizers", index: 2 },
] as const;

export type GenchemProductTabSlug = (typeof GENCHEM_PRODUCT_TABS)[number]["slug"];

const SLUG_BY_INDEX = new Map(GENCHEM_PRODUCT_TABS.map((t) => [t.index, t.slug]));
const INDEX_BY_SLUG = new Map(GENCHEM_PRODUCT_TABS.map((t) => [t.slug, t.index]));

const LEGACY_HASH: Record<string, GenchemProductTabSlug> = {
  "tab-1": "pvc-resins",
  "tab-2": "pvc-stabilizers",
};

export function getProductTabSlug(tabIndex: number): GenchemProductTabSlug | null {
  return SLUG_BY_INDEX.get(tabIndex) ?? null;
}

export function getProductTabIndex(slugOrLegacy: string): number | null {
  const normalized = LEGACY_HASH[slugOrLegacy] ?? slugOrLegacy;
  return INDEX_BY_SLUG.get(normalized as GenchemProductTabSlug) ?? null;
}

export function normalizeProductTabHash(hash: string): GenchemProductTabSlug | null {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw) return null;

  const slug = LEGACY_HASH[raw] ?? raw;
  return INDEX_BY_SLUG.has(slug as GenchemProductTabSlug) ? (slug as GenchemProductTabSlug) : null;
}

export function productTabHref(tabIndex: number): string {
  const slug = getProductTabSlug(tabIndex);
  return slug ? `/public/products#${slug}` : "/public/products";
}

export function parseProductTabFromHref(href: string): number | null {
  const slugMatch = href.match(/#([\w-]+)(?:\?.*)?$/);
  if (!slugMatch) return null;
  return getProductTabIndex(slugMatch[1]);
}

export function isProductsPagePath(pathname: string): boolean {
  return pathname === "/public/products" || pathname.endsWith("/products");
}
