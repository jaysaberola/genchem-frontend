/** Paths served from Next.js `public/images/genchemph/` (not the Laravel API). */
export function toGenchemphStaticPath(path?: string | null): string | undefined {
  if (path == null) return undefined;

  const raw = path.toString().trim().replace(/\\/g, "/");
  if (!raw) return undefined;

  const extract = (value: string): string | undefined => {
    const match =
      value.match(/\/public(\/images\/genchemph\/[^\s"'?#]+)/i) ??
      value.match(/(\/images\/genchemph\/[^\s"'?#]+)/i);
    if (!match) return undefined;
    const segment = match[1] ?? match[0];
    return segment.replace(/^\/public(?=\/images\/genchemph\/)/i, "");
  };

  if (/^https?:\/\//i.test(raw)) {
    const fromUrl = extract(raw);
    if (fromUrl) return fromUrl;
  }

  if (/^https?:\/\/local\b/i.test(raw)) {
    const fromLocal = extract(raw);
    if (fromLocal) return fromLocal;
  }

  const fromAbsolute = extract(raw);
  if (fromAbsolute) return fromAbsolute;

  if (/^\/?images\/genchemph\//i.test(raw)) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }

  return undefined;
}
