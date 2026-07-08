import type { AxiosError } from "axios";

export type PrivateContentInfo = {
  isPrivate: true;
  title?: string;
  slug?: string;
  kind: "page" | "article";
};

export function getPrivateContentFromError(error: unknown): PrivateContentInfo | null {
  const err = error as AxiosError<{ status?: string; title?: string; slug?: string }>;
  if (err?.response?.status !== 403) return null;
  if (err.response?.data?.status !== "private") return null;

  return {
    isPrivate: true,
    title: err.response.data.title,
    slug: err.response.data.slug,
    kind: "page",
  };
}

export function getPrivateArticleFromError(error: unknown): PrivateContentInfo | null {
  const info = getPrivateContentFromError(error);
  return info ? { ...info, kind: "article" } : null;
}
