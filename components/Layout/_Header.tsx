

import React, { useEffect, useState } from "react";

import Link from "next/link";

import Menu from "./_Menu";

import { getWebsiteSettingsCached, resolveCompanyLogoUrl, subscribeWebsiteSettingsUpdated } from "@/lib/websiteSettings";

import BrandLogo from "@/components/UI/BrandLogo";

import { DEFAULT_LOGO_SRC } from "@/lib/mediaAssets";



function resolveHeaderLogoUrl(settings: Record<string, unknown> | null | undefined): string | undefined {

  if (!settings) return undefined;



  const directUrl = settings.company_logo_url;

  if (typeof directUrl === "string" && directUrl.trim()) {

    return directUrl.trim();

  }



  return resolveCompanyLogoUrl(settings.company_logo as string | null | undefined);

}



export default function LandingTopbar({ overlayHero = true }: { overlayHero?: boolean }) {

  const [mobileOpen, setMobileOpen] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_SRC);

  const [logoAlt, setLogoAlt] = useState<string>("GENCHEM PH");

  const [telNo, setTelNo] = useState("8362-5347");

  const [mobileNo, setMobileNo] = useState("0923-582-7164");



  useEffect(() => {

    let alive = true;



    const refresh = async (opts?: { force?: boolean }) => {

      try {

        const s = (await getWebsiteSettingsCached({ force: opts?.force === true })) as Record<string, unknown>;

        if (!alive) return;



        setLogoUrl(resolveHeaderLogoUrl(s) || DEFAULT_LOGO_SRC);

        setLogoAlt(String(s?.website_name || s?.company_name || "GENCHEM PH"));

        if (s?.tel_no) setTelNo(String(s.tel_no).replace(/\s+/g, "-"));

        if (s?.mobile_no) setMobileNo(String(s.mobile_no).replace(/\s+/g, "-"));

      } catch {

        // ignore

      }

    };



    refresh({ force: true });

    const unsub = subscribeWebsiteSettingsUpdated(() => refresh({ force: true }));

    return () => {

      alive = false;

      unsub();

    };

  }, []);



  useEffect(() => {

    document.body.classList.toggle("primary-menu-open", mobileOpen);

    if (!mobileOpen) {

      document.documentElement.style.overflow = "";

      document.body.style.overflow = "";

      return;

    }



    document.documentElement.style.overflow = "hidden";

    document.body.style.overflow = "hidden";

    return () => {

      document.body.classList.remove("primary-menu-open");

      document.documentElement.style.overflow = "";

      document.body.style.overflow = "";

    };

  }, [mobileOpen]);



  useEffect(() => {

    const onResize = () => {

      if (window.innerWidth > 991) setMobileOpen(false);

    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);

  }, []);



  const closeMobileMenu = () => setMobileOpen(false);



  return (

    <header

      id="header"

      className={[

        "header-size-sm",

        "transparent-header",

        "floating-header",

        overlayHero ? "" : "genchem-header-static",

      ].join(" ")}

      data-sticky-shrink="false"

    >

      <div id="header-wrap">

        <div className="container">

          <div className="header-row">

            <div id="logo" className="me-lg-4 gemchem-logo">

              <Link href="/public/home">

                <BrandLogo

                  src={logoUrl}

                  alt={logoAlt}

                  className="py-2 genchem-brand-logo"

                  fallbackSrc={DEFAULT_LOGO_SRC}

                />

              </Link>

            </div>



            <div className="header-misc ms-auto">

              <div id="top-call" className="header-misc-icon d-flex flex-row align-items-center gap-2">

                <img

                  className="py-2 calling-icon"

                  src="/images/icons/call_red.png"

                  alt=""

                  aria-hidden="true"

                />

                <div className="genchem-header-phones fs-6 mb-0 d-flex flex-column">

                  <a href={`tel:${telNo.replace(/[^\d+]/g, "")}`} className="genchem-header-phone">

                    {telNo}

                  </a>

                  <a href={`tel:${mobileNo.replace(/[^\d+]/g, "")}`} className="genchem-header-phone">

                    {mobileNo}

                  </a>

                </div>

              </div>

            </div>



            <div className={`primary-menu-trigger ${mobileOpen ? "primary-menu-trigger-active" : ""}`}>

              <button

                className="cnvs-hamburger"

                type="button"

                title="Open Mobile Menu"

                aria-label={mobileOpen ? "Close menu" : "Open menu"}

                aria-expanded={mobileOpen}

                onClick={() => setMobileOpen((v) => !v)}

              >

                <span className="cnvs-hamburger-box">

                  <span className="cnvs-hamburger-inner" />

                </span>

              </button>

            </div>



            <nav className="primary-menu with-arrows">

              <ul className="menu-container">

                <Menu isMobile={mobileOpen} onNavigate={closeMobileMenu} />

              </ul>

            </nav>

          </div>

        </div>

      </div>

    </header>

  );

}


