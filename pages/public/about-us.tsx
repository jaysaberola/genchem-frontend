import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";

interface AboutUsPageProps {
  pageData: PublicPage;
  footerData?: Pick<PublicPage, "content" | "json" | "styles"> | null;
}

export async function getServerSideProps() {
  try {
    const [pageRes, footerRes] = await Promise.all([
      getPublicPageBySlug("about-us"),
      getPublicPageBySlug("footer"),
    ]);

    if (!pageRes.data) return { notFound: true };

    return {
      props: {
        pageData: pageRes.data,
        footerData: footerRes.data ?? null,
        layout: { fullWidth: true },
      },
    };
  } catch {
    return { notFound: true };
  }
}

export default function AboutUsPage({ pageData }: AboutUsPageProps) {
  const { htmlContent, css } = resolvePagePresentation(pageData);

  return (
    <div className="w-100 base-content">
      {htmlContent ? (
        <CmsHtmlBlock
          html={htmlContent}
          css={css}
          styleId="cms-about-us-styles"
          className="w-100 page-content cms-content public-page-content"
        />
      ) : (
        <div className="container py-5 text-center text-secondary">
          <p>No content available for this page.</p>
        </div>
      )}
    </div>
  );
}

AboutUsPage.Layout = LandingPageLayout;
