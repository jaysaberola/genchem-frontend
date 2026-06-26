import { useEffect } from "react";

import CmsFooter from "./_Footer";

import Banner from "./_Banner";

import { PublicAlbum } from "@/services/publicPageService";

import ToastHost from "@/components/UI/ToastHost";

import Head from "next/head";

import Header from "@/components/Layout/_Header";
import FloatingLogo from "@/components/Layout/FloatingLogo";
import GenchemCmsRuntime from "@/components/Cms/GenchemCmsRuntime";



interface LandingPageLayoutProps {

  children: React.ReactNode;

  pageData?: {

    title?: string;

    album?: PublicAlbum | null;

  };

  layout?: {

    fullWidth?: boolean;

    hideFooter?: boolean;

  };

}



function shouldOverlayHero(pageData?: LandingPageLayoutProps["pageData"]): boolean {

  const album = pageData?.album;

  const title = pageData?.title;



  if (!album?.banners?.length) return false;

  if (title === "News" || title === "Products") return false;



  return true;

}



export default function LandingPageLayout({

  children,

  pageData,

  layout,

}: LandingPageLayoutProps) {

  const overlayHero = shouldOverlayHero(pageData);



  const contentWrapperClassName = layout?.fullWidth ? "container-fluid px-0" : "";



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

    <div className="d-flex flex-column min-vh-100 genchemph stretched">

      <Head>

        <link rel="stylesheet" href="/css/cooper-fonts.css" />

        <link rel="stylesheet" href="/css/public-css.css" />

        <link rel="stylesheet" href="/css/product.css" />

        <link rel="stylesheet" href="/css/banner.css" />

        <link rel="stylesheet" href="/css/navigation.css" />

        <link rel="stylesheet" href="/css/genchem-theme.css" />

        <link rel="stylesheet" href="/css/public-overrides.css" />

        <link rel="stylesheet" href="/css/custom.css" />

      </Head>



      <div className={`genchem-hero-shell${overlayHero ? " genchem-hero-shell--overlay" : ""}`}>

        <Header overlayHero={overlayHero} />

        <Banner title={pageData?.title} album={pageData?.album} />

        {overlayHero && <FloatingLogo />}

      </div>

      <main
        className={[
          "flex-grow-1",
          layout?.fullWidth ? "" : overlayHero ? "genchem-main-with-floating-logo" : "py-5",
          !overlayHero ? "genchem-main-with-header-offset" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >

        <div className={contentWrapperClassName}>{children}</div>

      </main>



      {!layout?.hideFooter && <CmsFooter />}



      <ToastHost />

      <GenchemCmsRuntime />

    </div>

  );

}


