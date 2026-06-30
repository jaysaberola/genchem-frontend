import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolveFooterPresentation } from "@/lib/cmsPageContent";

type FooterPageData = Pick<PublicPage, "content" | "json" | "styles">;

interface CmsFooterProps {
  initialData?: FooterPageData | null;
}

function presentationFromPageData(pageData: FooterPageData & { contents?: string }) {
  return resolveFooterPresentation({
    content: pageData.content || pageData.contents || "",
    json: pageData.json,
    styles: pageData.styles,
  });
}

export default function CmsFooter({ initialData }: CmsFooterProps) {
  const [fetchedPresentation, setFetchedPresentation] = useState<{
    htmlContent: string;
    css: string;
  } | null>(null);

  const presentation = useMemo(() => {
    if (initialData) return presentationFromPageData(initialData);
    return fetchedPresentation;
  }, [initialData, fetchedPresentation]);

  useEffect(() => {
    if (initialData) return;

    let active = true;

    getPublicPageBySlug("footer")
      .then((res) => {
        if (!active || !res.data) return;
        setFetchedPresentation(presentationFromPageData(res.data));
      })
      .catch(() => {
        if (!active) return;
        setFetchedPresentation({ htmlContent: "", css: "" });
      });

    return () => {
      active = false;
    };
  }, [initialData]);

  const html = presentation?.htmlContent ?? "";
  const css = presentation?.css ?? "";

  if (!html) return null;

  return (
    <>
      {css ? (
        <Head>
          <style id="cms-footer-styles" dangerouslySetInnerHTML={{ __html: css }} />
        </Head>
      ) : null}
      <div
        className="cms-footer-content genchem-footer-shell"
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    </>
  );
}
