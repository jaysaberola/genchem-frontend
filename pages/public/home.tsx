import React, { useEffect } from "react";
import Head from "next/head";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { registerGenchemTabs } from "@/lib/genchemTabs";
import { initGenchemVideos } from "@/lib/genchemMedia";
import { initGenchemTrustBar } from "@/lib/genchemTrustBar";
import { resolvePagePresentation } from "@/lib/cmsPageContent";

export const BANNER_TITLE = "GENCHEM PH";

export async function getServerSideProps() {
    try {
        const [pageRes, footerRes] = await Promise.all([
            getPublicPageBySlug("home"),
            getPublicPageBySlug("footer"),
        ]);

        return {
            props: {
                pageData: pageRes.data ?? null,
                footerData: footerRes.data ?? null,
                layout: { fullWidth: true },
            },
        };
    } catch (error) {
        console.error("Error fetching page data:", error);
        return { notFound: true };
    }
}

interface LandingPageLayoutProps {
  pageData?: PublicPage;
  layout?: {
    fullWidth?: boolean;
  };
}

export default function Home({ pageData }: LandingPageLayoutProps) {
    const { htmlContent, css } = pageData
        ? resolvePagePresentation(pageData)
        : { htmlContent: "", css: "" };

    useEffect(() => {
        const cleanup = registerGenchemTabs();
        initGenchemVideos();
        const cleanupTrustBar = initGenchemTrustBar();
        return () => {
            cleanup();
            cleanupTrustBar();
        };
    }, [htmlContent]);

    return (
        <>
            {css ? (
                <Head>
                    <style id="cms-home-styles" dangerouslySetInnerHTML={{ __html: css }} />
                </Head>
            ) : null}

            <div>
                <div className="w-100 base-content">
                    {htmlContent ? (
                        <div
                            className="w-100 page-content cms-content public-page-content"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    ) : null}
                </div>

                <style jsx global>{`
                    .cms-content img,
                    .public-page-content img {
                        max-width: 100%;
                        height: auto;
                    }
                    .cms-content table,
                    .public-page-content table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 1rem;
                    }
                    .cms-content table td,
                    .cms-content table th,
                    .public-page-content table td,
                    .public-page-content table th {
                        border: 1px solid #dee2e6;
                        padding: 0.5rem 0.75rem;
                    }
                `}</style>
            </div>
        </>
    );
}

Home.Layout = LandingPageLayout;
