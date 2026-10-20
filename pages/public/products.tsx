import { useEffect } from "react";
import { useRouter } from "next/router";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { activateTabFromHash, registerGenchemTabs } from "@/lib/genchemTabs";
import {
  buildSlimPublicPageProps,
  type PublicPageShell,
} from "@/lib/publicPageServerProps";
import { initGenchemProductCards } from "@/lib/genchemProductCards";
import { initGenchemVideos } from "@/lib/genchemMedia";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";

function scheduleTabFromHash(): void {
  activateTabFromHash();
  window.setTimeout(activateTabFromHash, 50);
  window.setTimeout(activateTabFromHash, 250);
}

function scheduleProductCards(): void {
  initGenchemProductCards();
  window.setTimeout(initGenchemProductCards, 50);
  window.setTimeout(initGenchemProductCards, 300);
}

interface ProductsPageProps {
  pageShell: PublicPageShell;
  cmsHtml: string;
  cmsCss: string;
  footerData?: Pick<PublicPage, "content" | "json" | "styles"> | null;
}

export async function getServerSideProps() {
  try {
    const [pageRes, footerRes] = await Promise.all([
      getPublicPageBySlug("products"),
      getPublicPageBySlug("footer"),
    ]);

    if (!pageRes.data) return { notFound: true };

    return {
      props: {
        ...buildSlimPublicPageProps(pageRes.data, {
          footerData: footerRes.data ?? null,
          layout: { fullWidth: true },
        }),
      },
    };
  } catch {
    return { notFound: true };
  }
}

export default function ProductsPage({ cmsHtml, cmsCss }: ProductsPageProps) {
  const router = useRouter();
  const htmlContent = cmsHtml;
  const css = cmsCss;

  useEffect(() => {
    document.body.classList.add("genchem-products-active");
    const cleanup = registerGenchemTabs();
    initGenchemVideos();
    scheduleTabFromHash();
    scheduleProductCards();

    const onHashChange = () => {
      scheduleTabFromHash();
      scheduleProductCards();
    };
    window.addEventListener("hashchange", onHashChange);

    const onRouteComplete = (url: string) => {
      if ((url.startsWith("/products") || url.includes("/public/products")) && url.includes("#")) {
        scheduleTabFromHash();
        scheduleProductCards();
      }
    };
    router.events.on("routeChangeComplete", onRouteComplete);

    return () => {
      document.body.classList.remove("genchem-products-active");
      cleanup();
      window.removeEventListener("hashchange", onHashChange);
      router.events.off("routeChangeComplete", onRouteComplete);
    };
  }, [router, htmlContent]);

  return (
    <div className="w-100 base-content genchem-products-page">
      {htmlContent ? (
        <CmsHtmlBlock
          html={htmlContent}
          css={css}
          styleId="cms-products-styles"
          className="w-100 page-content cms-content public-page-content genchem-products-page"
        />
      ) : (
        <div className="container py-5 text-center text-secondary">
          <p>No content available for this page.</p>
        </div>
      )}
    </div>
  );
}

ProductsPage.Layout = LandingPageLayout;
