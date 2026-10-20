import LandingPageLayout from "@/components/Layout/GuestLayout";
import PrivateContentNotice from "@/components/Cms/PrivateContentNotice";
import { getPublicPageBySlug } from "@/services/publicPageService";
import { getPrivateContentFromError } from "@/lib/cmsPrivateContent";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";
import {
  buildSlimPublicPageProps,
  type PublicPageShell,
} from "@/lib/publicPageServerProps";

interface PublicPageViewProps {
  pageShell?: PublicPageShell | null;
  cmsHtml?: string;
  cmsCss?: string;
  isPrivate?: boolean;
  privateTitle?: string;
}

export default function PublicPageView({
  pageShell,
  cmsHtml = "",
  cmsCss = "",
  isPrivate,
  privateTitle,
}: PublicPageViewProps) {
  if (isPrivate) {
    return <PrivateContentNotice title={privateTitle} kind="page" />;
  }

  if (!pageShell) {
    return <div className="container py-5 text-center text-secondary">Page not found</div>;
  }

  return (
    <>
      {cmsHtml ? (
        <CmsHtmlBlock
          html={cmsHtml}
          css={cmsCss}
          styleId={`page-styles-${pageShell.slug ?? pageShell.id}`}
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
        ...buildSlimPublicPageProps(pageData, {
          isPrivate: false,
          footerData: footerRes.data ?? null,
          layout: {
            fullWidth: true,
            hideFooter: page === "footer",
          },
        }),
      },
    };
  } catch (error) {
    const privateInfo = getPrivateContentFromError(error);
    if (privateInfo) {
      return {
        props: {
          pageShell: null,
          cmsHtml: "",
          cmsCss: "",
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