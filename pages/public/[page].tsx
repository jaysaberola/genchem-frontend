import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";
import Head from "next/head";

interface PublicPageViewProps {
  pageData: PublicPage;
}

export default function PublicPageView({ pageData }: PublicPageViewProps) {
  if (!pageData) return <div>Page not found</div>;

  const { htmlContent, css: cssStyles } = resolvePagePresentation(pageData);

  return (
    <>
      <Head>
        {pageData.meta?.title && <title>{pageData.meta.title}</title>}
        {pageData.meta?.description && (
          <meta name="description" content={pageData.meta.description} />
        )}
        {pageData.meta?.keywords && (
          <meta name="keywords" content={pageData.meta.keywords} />
        )}
      </Head>

      {htmlContent ? (
        <CmsHtmlBlock
          html={htmlContent}
          css={cssStyles}
          styleId={`page-styles-${pageData.slug ?? pageData.id}`}
          className="public-page-content cms-content"
        />
      ) : (
        <div className="container py-5 text-center text-secondary">
          <p>No content available for this page.</p>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { page } = context.params;

  try {
    const [pageRes, footerRes] = await Promise.all([
      getPublicPageBySlug(page),
      getPublicPageBySlug("footer"),
    ]);
    const pageData = pageRes.data ?? null;

    if (!pageData) return { notFound: true };

    return {
      props: {
        pageData,
        footerData: footerRes.data ?? null,
        layout: {
          fullWidth: true,
          hideFooter: page === "footer",
        },
      },
    };
  } catch {
    return { notFound: true };
  }
}

PublicPageView.Layout = LandingPageLayout;