import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { initGenchemContactForm, patchContactUsForm } from "@/lib/genchemContactForm";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";
import { formatCmsHtmlForViewSource } from "@/lib/formatCmsMarkup";
import {
  buildSlimPublicPageProps,
  type PublicPageShell,
} from "@/lib/publicPageServerProps";
import { useEffect } from "react";

interface ContactUsPageProps {
  pageShell: PublicPageShell;
  cmsHtml: string;
  cmsCss: string;
  footerData?: Pick<PublicPage, "content" | "json" | "styles"> | null;
}

export async function getServerSideProps() {
  try {
    const [pageRes, footerRes] = await Promise.all([
      getPublicPageBySlug("contact-us"),
      getPublicPageBySlug("footer"),
    ]);

    if (!pageRes.data) return { notFound: true };

    const slim = buildSlimPublicPageProps(pageRes.data, {
      footerData: footerRes.data ?? null,
      layout: { fullWidth: true, hideFooter: true },
    });

    return {
      props: {
        ...slim,
        cmsHtml: formatCmsHtmlForViewSource(patchContactUsForm(slim.cmsHtml)),
      },
    };
  } catch {
    return { notFound: true };
  }
}

export default function ContactUsPage({ cmsHtml, cmsCss }: ContactUsPageProps) {
  useEffect(() => {
    initGenchemContactForm();
  }, [cmsHtml]);

  return (
    <div className="w-100 base-content genchem-contact-us-page public-contact">
      {cmsHtml ? (
        <CmsHtmlBlock
          html={cmsHtml}
          css={cmsCss}
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
