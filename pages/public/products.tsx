import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { resolvePagePresentation } from "@/lib/cmsPageContent";
import { activateTabFromHash, registerGenchemTabs } from "@/lib/genchemTabs";
import { initGenchemProductCards } from "@/lib/genchemProductCards";
import { initGenchemVideos } from "@/lib/genchemMedia";

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
  pageData: PublicPage;
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
        pageData: pageRes.data,
        footerData: footerRes.data ?? null,
        layout: { fullWidth: true },
      },
    };
  } catch {
    return { notFound: true };
  }
}

export default function ProductsPage({ pageData }: ProductsPageProps) {
  const router = useRouter();
  const { htmlContent, css } = resolvePagePresentation(pageData);

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
      if (url.includes("/public/products") && url.includes("#")) {
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
    <>
      <Head>
        {css ? (
          <style id="cms-products-styles" dangerouslySetInnerHTML={{ __html: css }} />
        ) : null}
      </Head>

      <div className="w-100 base-content genchem-products-page">
        {htmlContent ? (
          <div
            className="w-100 page-content cms-content public-page-content genchem-products-page"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="container py-5 text-center text-secondary">
            <p>No content available for this page.</p>
          </div>
        )}
      </div>
    </>
  );
}

ProductsPage.Layout = LandingPageLayout;
