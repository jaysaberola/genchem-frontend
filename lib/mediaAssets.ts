export const DEFAULT_LOGO_SRC = "/images/logos/genchemph-logo-transparent.png";

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

/** Resolve logo/favicon/image paths from website settings or the file manager. */
export function resolveManagedAssetUrl(path?: string | null): string | undefined {
  const raw = (path ?? "").toString().trim();
  if (!raw) return undefined;

  if (raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;

  if (raw.startsWith("/images/") || raw.startsWith("/img/") || raw.startsWith("/icons/")) {
    return raw;
  }

  const base = apiBase();
  let rel = raw.replace(/\\/g, "/").replace(/^\.\/?/, "");

  if (base && rel.startsWith(base)) {
    rel = rel.slice(base.length).replace(/^\//, "");
  }

  const fileManagerIdx = rel.indexOf("file-manager/");
  if (fileManagerIdx >= 0) {
    rel = rel.slice(fileManagerIdx);
    return base ? `${base}/${rel}` : `/${rel}`;
  }

  if (rel.startsWith("/storage/")) return base ? `${base}${rel}` : rel;
  if (rel.startsWith("storage/")) return base ? `${base}/${rel}` : `/${rel}`;
  if (rel.startsWith("/uploads/")) return base ? `${base}${rel}` : rel;
  if (rel.startsWith("uploads/")) return base ? `${base}/${rel}` : `/${rel}`;

  if (rel.startsWith("/")) return base ? `${base}${rel}` : rel;

  if (!rel.includes("/") && base) {
    return `${base}/storage/logos/${rel}`;
  }

  if (rel.startsWith("logos/")) {
    return base ? `${base}/storage/${rel}` : `/storage/${rel}`;
  }

  if (rel.startsWith("icons/")) {
    return base ? `${base}/storage/${rel}` : `/storage/${rel}`;
  }

  if (base) return `${base}/storage/${rel}`;
  return `/${rel}`;
}

export function resolveCompanyLogoUrl(path?: string | null): string | undefined {
  return resolveManagedAssetUrl(path);
}

export function resolveFaviconUrl(path?: string | null): string | undefined {
  const raw = (path ?? "").toString().trim();
  if (!raw) return undefined;

  const direct = resolveManagedAssetUrl(raw);
  if (direct && (raw.includes("file-manager") || raw.startsWith("http"))) {
    return direct;
  }

  const base = apiBase();
  if (base && raw && !raw.includes("/") && !raw.startsWith("http")) {
    return `${base}/storage/icons/${raw}`;
  }

  return direct;
}

export function openFileManagerPicker(
  type: "Images" | "Files",
  onSelect: (url: string) => void
) {
  const base = apiBase();
  if (!base) return;

  const prefix = `${base}/laravel-filemanager`;
  window.open(`${prefix}?type=${type}`, "FileManager", "width=960,height=640");

  (window as any).SetUrl = (url: string) => {
    if (url) onSelect(url);
  };
}
