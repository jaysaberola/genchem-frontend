/** Public URL for a CMS page. The home page is the site root. */
export function publicPagePath(slug: string | null | undefined): string {
  const clean = (slug || "").replace(/^\/+|\/+$/g, "");
  if (!clean || clean === "home" || clean === "public/home") return "/";
  return `/public/${clean}`;
}
