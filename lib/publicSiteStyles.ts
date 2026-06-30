import {
  getCmsFooterThemeStylesheetUrls,
  getCmsThemeStylesheetUrls,
} from "@/lib/cmsThemeAssets";

/** Local stylesheets for the public site (load order matters). */
export const PUBLIC_LOCAL_STYLESHEETS = [
  "/css/cooper-fonts.css?v=3",
  "/css/all.min.css",
  "/css/public-css.css",
  "/css/product.css",
  "/css/banner.css",
  "/css/navigation.css",
  "/css/genchem-theme.css",
  "/css/genchemph-design.css",
  "/css/genchemph-about-us.css",
  "/css/genchemph-drone.css",
  "/css/public-overrides.css",
  "/css/custom.css",
  "/css/genchemph-grapesjs.css?v=3",
  "/css/genchemph-cms-typography.css?v=3",
  "/css/genchemph-products.css?v=10",
  "/css/genchemph-home-intro.css?v=5",
  "/css/genchemph-contact-us.css?v=2",
  "/css/cms-footer.css?v=8",
] as const;

export const ADMIN_STYLESHEETS = ["/css/custom.css", "/css/admin.css"] as const;

const ADMIN_ROUTE_PREFIXES = [
  "/account-management",
  "/banners",
  "/dashboard",
  "/files",
  "/menu",
  "/news",
  "/pages",
  "/products",
  "/settings",
  "/testimonials",
  "/users",
] as const;

export function isPublicSiteRoute(pathname: string): boolean {
  return pathname.startsWith("/public");
}

export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function getPublicSiteStylesheets(): string[] {
  return Array.from(
    new Set([
      ...PUBLIC_LOCAL_STYLESHEETS,
      ...getCmsThemeStylesheetUrls(),
      ...getCmsFooterThemeStylesheetUrls(),
    ]),
  );
}

export function getDocumentStylesheets(pathname: string): string[] {
  if (isPublicSiteRoute(pathname)) {
    return getPublicSiteStylesheets();
  }

  if (isAdminRoute(pathname)) {
    return [...ADMIN_STYLESHEETS];
  }

  return [];
}
