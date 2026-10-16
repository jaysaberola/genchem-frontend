/** Paths served from Next.js `public/images/genchemph/` (not the Laravel API). */
export function toGenchemphStaticPath(path?: string | null): string | undefined {
  if (path == null) return undefined;

  const raw = path.toString().trim().replace(/\\/g, "/");
  if (!raw) return undefined;

  const fromAbsolute = raw.match(/(\/images\/genchemph\/[^\s"'?#]+)/i);
  if (fromAbsolute) {
    return fromAbsolute[1].replace(/^\/public(?=\/images\/genchemph\/)/i, "");
  }

  if (/^\/?images\/genchemph\//i.test(raw)) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }

  return undefined;
}
