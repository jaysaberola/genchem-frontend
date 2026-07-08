import dynamic from "next/dynamic";

/** Client-only public-site widgets (skip SSR to prevent hydration mismatches). */
export const CmsFooter = dynamic(() => import("@/components/Layout/_Footer"), { ssr: false });
export const GoToTop = dynamic(() => import("@/components/Layout/GoToTop"), { ssr: false });
export const ToastHost = dynamic(() => import("@/components/UI/ToastHost"), { ssr: false });
export const GenchemCmsRuntime = dynamic(() => import("@/components/Cms/GenchemCmsRuntime"), { ssr: false });
export const CmsHtmlBlock = dynamic(() => import("@/components/Cms/CmsHtmlBlock"), { ssr: false });
