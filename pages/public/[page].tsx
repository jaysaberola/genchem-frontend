import LandingPageLayout from "@/components/Layout/GuestLayout";
import PrivateContentNotice from "@/components/Cms/PrivateContentNotice";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
import { getPrivateContentFromError } from "@/lib/cmsPrivateContent";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";

interface PublicPageViewProps {
  pageData: PublicPage | null;
  isPrivate?: boolean;
  privateTitle?: string;
}

export default function PublicPageView({ pageData, isPrivate, privateTitle }: PublicPageViewProps) {
  if (isPrivate) {
    return <PrivateContentNotice title={privateTitle} kind="page" />;
  }

  if (!pageData) return <div className="container py-5 text-center text-secondary">Page not found</div>;

  const { htmlContent, css: cssStyles } = resolvePagePresentation(pageData);

  return (
    <>
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
  const previewToken = typeof context.query?.preview_token === "string" ? context.query.preview_token : undefined;

  try {
    const [pageRes, footerRes] = await Promise.all([
      getPublicPageBySlug(page, previewToken ? { preview_token: previewToken } : undefined),
      getPublicPageBySlug("footer"),
    ]);
    const pageData = pageRes.data ?? null;

    if (!pageData) return { notFound: true };

    return {
      props: {
        pageData,
        isPrivate: false,
        footerData: footerRes.data ?? null,
        layout: {
          fullWidth: true,
          hideFooter: page === "footer",
        },
      },
    };
  } catch (error) {
    const privateInfo = getPrivateContentFromError(error);
    if (privateInfo) {
      return {
        props: {
          pageData: null,
          isPrivate: true,
          privateTitle: privateInfo.title ?? page,
          footerData: null,
          layout: {
            fullWidth: true,
            hideFooter: false,
          },
        },
      };
    }
    return { notFound: true };
  }
}

PublicPageView.Layout = LandingPageLayout;