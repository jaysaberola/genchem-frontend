/** Theme stylesheets for CMS footer (match GrapesJS canvas load order for spacing/utilities). */
export const CMS_FOOTER_THEME_STYLES = [
  "/theme/css/bootstrap.css",
  "/theme/css/font-icons.css",
  "/theme/css/fontawesome.css",
] as const;

/** Theme stylesheets for CMS content (avoid dark.css — it paints .section.dark black). */
export const CMS_THEME_STYLES = [
  "/theme/css/font-icons.css",
  "/theme/css/custom.css",
] as const;

export function getCmsApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

export function getCmsThemeStylesheetUrls(): string[] {
  const base = getCmsApiBase();
  if (!base) return [];
  return CMS_THEME_STYLES.map((path) => `${base}${path}`);
}

export function getCmsFooterThemeStylesheetUrls(): string[] {
  const base = getCmsApiBase();
  if (!base) return [];
  return CMS_FOOTER_THEME_STYLES.map((path) => `${base}${path}`);
}
