/** Next.js admin routes under `/news/*` (not public articles). */
const ADMIN_NEWS_SEGMENTS = new Set([
  "create",
  "category_index",
  "category_create",
  "edit",
  "index",
]);

/** Admin screens that must keep their own URLs. Public `/products` is the storefront. */
const ADMIN_SLUGS = new Set([
  "account-management",
  "banners",
  "dashboard",
  "files",
  "forgot-password",
  "login",
  "menu",
  "news",
  "pages",
  "reset-password",
  "settings",
  "testimonials",
  "users",
]);

/** Public URL for a CMS page. The home page is the site root. */
export function publicPagePath(slug: string | null | undefined): string {
  const clean = (slug || "").replace(/^\/+|\/+$/g, "");
  const bare = clean.replace(/^public\//, "");
  if (!bare || bare === "home") return "/";

  const head = bare.split("/")[0];
  if (head === "news" && bare.includes("/")) {
    const segment = bare.split("/")[1] ?? "";
    if (segment && !ADMIN_NEWS_SEGMENTS.has(segment)) {
      return `/${bare}`;
    }
  }

  if (ADMIN_SLUGS.has(head)) return `/public/${bare}`;
  return `/${bare}`;
}

/** Public news article URL (slug only, no `news/` prefix). */
export function publicNewsArticlePath(slug: string | null | undefined): string {
  const clean = (slug || "").replace(/^\/+|\/+$/g, "").replace(/^news\//, "");
  return clean ? `/news/${clean}` : "/news";
}

/** Turn `/public/about-us` menu and content links into `/about-us`. */
export function toPublicHref(target: string): string {
  if (!target) return target;

  try {
    const url = new URL(target, "http://local");
    const pathname = url.pathname.replace(/\/$/, "") || "/";
    if (pathname !== "/public" && !pathname.startsWith("/public/")) return target;

    const nextPath = publicPagePath(pathname.replace(/^\/public\/?/, ""));
    if (/^https?:\/\//i.test(target)) {
      url.pathname = nextPath;
      return url.toString();
    }

    return `${nextPath}${url.search}${url.hash}`;
  } catch {
    return target;
  }
}
