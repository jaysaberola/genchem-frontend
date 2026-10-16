/** Laravel host only — strips trailing slashes and legacy `/public` suffix. */
export function normalizeApiOrigin(raw?: string | null): string {
  let base = (raw ?? process.env.NEXT_PUBLIC_API_URL ?? "").trim();
  base = base.replace(/\/+$/, "");
  base = base.replace(/\/public$/i, "");
  return base;
}

/** Full REST base (`{origin}/api`) for server-side requests. */
export function serverApiBaseUrl(): string {
  const origin = normalizeApiOrigin();
  return origin ? `${origin}/api` : "/api";
}

/**
 * Browser calls same-origin `/cms-api` (Next rewrite → Laravel) to avoid CORS.
 * Server render uses the real API host.
 */
export function resolveAxiosBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/cms-api";
  }
  return serverApiBaseUrl();
}
