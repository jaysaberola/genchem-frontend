import Head from "next/head";
import { useEffect, useState } from "react";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { getCmsFooterThemeStylesheetUrls } from "@/lib/cmsThemeAssets";
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
  const initialPresentation = initialData ? presentationFromPageData(initialData) : null;
  const [html, setHtml] = useState(initialPresentation?.htmlContent ?? "");
  const [css, setCss] = useState(initialPresentation?.css ?? "");

  useEffect(() => {
    if (initialData) return;

    getPublicPageBySlug("footer")
      .then((res) => {
        const pageData = res.data;
        if (!pageData) return;

        const { htmlContent, css: pageCss } = resolveFooterPresentation(pageData);
        setHtml(htmlContent);
        setCss(pageCss);
      })
      .catch(() => {
        setHtml("");
        setCss("");
      });
  }, [initialData]);

  if (!html) return null;

  const footerThemeStyles = getCmsFooterThemeStylesheetUrls();

  return (
    <>
      <Head>
        {footerThemeStyles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <link rel="stylesheet" href="/css/cms-footer.css?v=7" />
      </Head>
      {css ? <style id="cms-footer-styles" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <div className="cms-footer-content genchem-footer-shell" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
