import { useEffect } from "react";

import CmsFooter from "./_Footer";

import Banner from "./_Banner";

import { PublicAlbum, PublicPage } from "@/services/publicPageService";

import ToastHost from "@/components/UI/ToastHost";

import Head from "next/head";

import Header from "@/components/Layout/_Header";
import FloatingLogo from "@/components/Layout/FloatingLogo";
import GoToTop from "@/components/Layout/GoToTop";
import GenchemCmsRuntime from "@/components/Cms/GenchemCmsRuntime";
import { getCmsThemeStylesheetUrls } from "@/lib/cmsThemeAssets";



interface LandingPageLayoutProps {

  children: React.ReactNode;

  pageData?: {

    title?: string;

    slug?: string;

    album?: PublicAlbum | null;

  };

  layout?: {

    fullWidth?: boolean;

    hideFooter?: boolean;

  };

  footerData?: Pick<PublicPage, "content" | "json" | "styles"> | null;

}



function shouldOverlayHero(pageData?: LandingPageLayoutProps["pageData"]): boolean {

  const album = pageData?.album;

  const title = pageData?.title;



  if (!album?.banners?.length) return false;

  if (title === "News") return false;



  return true;

}



export default function LandingPageLayout({

  children,

  pageData,

  layout,

  footerData,

}: LandingPageLayoutProps) {

  const overlayHero = shouldOverlayHero(pageData);
  const isHomeBanner = pageData?.album?.type === "main_banner";
  const themeStylesheets = getCmsThemeStylesheetUrls();



  const contentWrapperClassName = layout?.fullWidth ? "container-fluid px-0" : "";

  const mainClassName = [
    !overlayHero ? "genchem-main-with-header-offset" : "",
    !layout?.fullWidth && !overlayHero ? "py-5" : "",
  ]
    .filter(Boolean)
    .join(" ");



  useEffect(() => {

    const syncExpandedMenu = () => {

      document.body.classList.toggle("is-expanded-menu", window.innerWidth >= 992);

    };



    syncExpandedMenu();

    window.addEventListener("resize", syncExpandedMenu);

    return () => {

      window.removeEventListener("resize", syncExpandedMenu);

      document.body.classList.remove("is-expanded-menu");

    };

  }, []);



  return (

    <div className="genchemph stretched has-plugin-html5video">

      <Head>

        <link rel="stylesheet" href="/css/cooper-fonts.css" />

        <link rel="stylesheet" href="/css/all.min.css" />

        <link rel="stylesheet" href="/css/public-css.css" />

        <link rel="stylesheet" href="/css/product.css" />

        <link rel="stylesheet" href="/css/banner.css" />

        <link rel="stylesheet" href="/css/navigation.css" />

        <link rel="stylesheet" href="/css/genchem-theme.css" />

        <link rel="stylesheet" href="/css/genchemph-design.css" />

        <link rel="stylesheet" href="/css/genchemph-about-us.css" />

        <link rel="stylesheet" href="/css/genchemph-drone.css" />

        <link rel="stylesheet" href="/css/public-overrides.css" />

        <link rel="stylesheet" href="/css/custom.css" />

        {!layout?.hideFooter &&
          themeStylesheets.map((href) => (
            <link key={href} rel="stylesheet" href={href} />
          ))}

        {/* Must load after theme CSS so video section overrides win */}
        <link rel="stylesheet" href="/css/genchemph-grapesjs.css" />

        {/* Beat Pato main.css Montserrat / 15px on CMS paragraphs */}
        <link rel="stylesheet" href="/css/genchemph-cms-typography.css" />

        <link rel="stylesheet" href="/css/genchemph-products.css?v=10" />

      </Head>



      <Header overlayHero={overlayHero} />

      <div
        className={[
          "genchem-hero-shell",
          overlayHero ? "genchem-hero-shell--overlay" : "",
          overlayHero && pageData?.album?.type !== "main_banner" ? "genchem-hero-shell--subpage" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >

        <Banner title={pageData?.title} album={pageData?.album} />

      </div>

      {overlayHero && (
        <FloatingLogo variant={isHomeBanner ? "home" : "subpage"} />
      )}

      <div id="wrapper" className="about-us-page genchem-public-shell">
        <main id="content" className={mainClassName || undefined}>
          <div className={contentWrapperClassName}>{children}</div>
        </main>
        {!layout?.hideFooter && <CmsFooter initialData={footerData} />}
      </div>



      <GoToTop />

      <ToastHost />

      <GenchemCmsRuntime />

    </div>

  );

}


