import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
import { initGenchemContactForm, patchContactUsForm } from "@/lib/genchemContactForm";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";
import { useEffect } from "react";

interface ContactUsPageProps {
  pageData: PublicPage;
  footerData?: Pick<PublicPage, "content" | "json" | "styles"> | null;
}

export async function getServerSideProps() {
  try {
    const [pageRes, footerRes] = await Promise.all([
      getPublicPageBySlug("contact-us"),
      getPublicPageBySlug("footer"),
    ]);

    if (!pageRes.data) return { notFound: true };

    return {
      props: {
        pageData: pageRes.data,
        footerData: footerRes.data ?? null,
        layout: { fullWidth: true, hideFooter: true },
      },
    };
  } catch {
    return { notFound: true };
  }
}

export default function ContactUsPage({ pageData }: ContactUsPageProps) {
  const { htmlContent, css } = resolvePagePresentation(pageData);
  const content = patchContactUsForm(htmlContent);

  useEffect(() => {
    initGenchemContactForm();
  }, [content]);

  return (
    <div className="w-100 base-content genchem-contact-us-page public-contact">
      {content ? (
        <CmsHtmlBlock
          html={content}
          css={css}
          styleId="cms-contact-us-styles"
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

ContactUsPage.Layout = LandingPageLayout;
