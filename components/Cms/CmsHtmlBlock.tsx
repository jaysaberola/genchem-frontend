export interface CmsHtmlBlockProps {
  html?: string;
  css?: string;
  className?: string;
  styleId?: string;
}

/** Renders CMS HTML/CSS on the client only to avoid hydration mismatches. */
export default function CmsHtmlBlock({
  html,
  css,
  className,
  styleId = "cms-page-styles",
}: CmsHtmlBlockProps) {
  if (!html && !css) return null;

  return (
    <>
      {css ? <style id={styleId} dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {html ? (
        <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
      ) : null}
    </>
  );
}
