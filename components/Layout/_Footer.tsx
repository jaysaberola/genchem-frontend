import { useEffect, useState } from "react";
import { getPublicPageBySlug } from "@/services/publicPageService";
import { resolvePageContent, resolvePageStyles } from "@/lib/cmsPageContent";

export default function CmsFooter() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");

  useEffect(() => {
    getPublicPageBySlug("footer")
      .then((res) => {
        const pageData = res.data;
        if (!pageData) return;

        setHtml(resolvePageContent(pageData));
        setCss(resolvePageStyles(pageData));
      })
      .catch(() => {
        setHtml("");
        setCss("");
      });
  }, []);

  if (!html) return null;

  return (
    <>
      {css ? <style id="cms-footer-styles" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <div className="cms-footer-content" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
