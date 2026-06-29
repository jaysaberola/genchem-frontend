import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
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
        {/* Page-specific scoped styles from the CMS/GrapesJS editor */}
        {cssStyles && (
          <style
            id={`page-styles-${pageData.slug ?? pageData.id}`}
            dangerouslySetInnerHTML={{ __html: cssStyles }}
          />
        )}

        {/* Optional: page-level SEO meta tags */}
        {pageData.meta?.title && <title>{pageData.meta.title}</title>}
        {pageData.meta?.description && (
          <meta name="description" content={pageData.meta.description} />
        )}
        {pageData.meta?.keywords && (
          <meta name="keywords" content={pageData.meta.keywords} />
        )}
      </Head>

      {/* Rendered CMS HTML content */}
      {htmlContent ? (
        <div
          className="public-page-content cms-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
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