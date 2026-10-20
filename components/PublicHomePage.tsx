import React, { useEffect } from "react";
import { getPublicPageBySlug } from "@/services/publicPageService";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { registerGenchemTabs } from "@/lib/genchemTabs";
import { initGenchemVideos } from "@/lib/genchemMedia";
import { initGenchemTrustBar } from "@/lib/genchemTrustBar";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";
import {
  buildSlimPublicPageProps,
  type PublicPageShell,
} from "@/lib/publicPageServerProps";

export const BANNER_TITLE = "GENCHEM PH";

export async function getPublicHomeProps() {
    try {
        const [pageRes, footerRes] = await Promise.all([
            getPublicPageBySlug("home"),
            getPublicPageBySlug("footer"),
        ]);

        if (!pageRes.data) {
            return {
                props: {
                    pageShell: null,
                    cmsHtml: "",
                    cmsCss: "",
                    footerData: footerRes.data ?? null,
                    layout: { fullWidth: true },
                },
            };
        }

        return {
            props: {
                ...buildSlimPublicPageProps(pageRes.data, {
                    footerData: footerRes.data ?? null,
                    layout: { fullWidth: true },
                }),
            },
        };
    } catch (error) {
        console.error("Error fetching page data:", error);
        return {
            props: {
                pageShell: null,
                cmsHtml: "",
                cmsCss: "",
                footerData: null,
                layout: { fullWidth: true },
            },
        };
    }
}

interface PublicHomePageProps {
  pageShell?: PublicPageShell | null;
  cmsHtml?: string;
  cmsCss?: string;
  layout?: {
    fullWidth?: boolean;
  };
}

export default function PublicHomePage({ cmsHtml = "", cmsCss = "" }: PublicHomePageProps) {
    const htmlContent = cmsHtml;
    const css = cmsCss;

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
        <div>
            <div className="w-100 base-content">
                {htmlContent ? (
                    <CmsHtmlBlock
                        html={htmlContent}
                        css={css}
                        styleId="cms-home-styles"
                        className="w-100 page-content cms-content public-page-content"
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
    );
}

PublicHomePage.Layout = LandingPageLayout;
