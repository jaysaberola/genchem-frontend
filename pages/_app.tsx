import "bootstrap/dist/css/bootstrap.min.css"; //AdminLayout
import "@fortawesome/fontawesome-free/css/all.min.css"; //AdminLayout
import "@/styles/custom.css"; // Custom CSS

// NOTE: Admin template styles are loaded in AdminLayout via <link href="/css/admin.css" />
// to prevent global CSS from merging into GuestLayout.

import App, { type AppContext, type AppProps } from "next/app";
import React from "react";
import Head from "next/head";
import Script from "next/script";
import LoadingProvider from "@/plugins/loading/LoadingProvider";
import { fetchPublicGoogleAnalyticsSnippet } from "@/lib/googleAnalytics";
import { isPublicBrowserPath } from "@/lib/publicSiteStyles";

type AppPropsWithLayout = AppProps & {
  googleAnalyticsSnippet?: string | null;
  Component: AppProps["Component"] & {
    Layout?: React.ComponentType<{ children: React.ReactNode }>;
  };
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const pathname = appContext.router?.pathname ?? appContext.ctx.pathname ?? "";
  let googleAnalyticsSnippet: string | null = null;

  if (appContext.ctx.req && isPublicBrowserPath(pathname)) {
    googleAnalyticsSnippet = await fetchPublicGoogleAnalyticsSnippet();
  }

  return {
    ...appProps,
    googleAnalyticsSnippet,
  };
};

export default function MyApp({
  Component,
  pageProps,
  googleAnalyticsSnippet,
}: AppPropsWithLayout) {
  const Layout = Component.Layout || React.Fragment;
  const layoutProps = {
    ...pageProps,
    googleAnalytics:
      (pageProps as { googleAnalytics?: string | null }).googleAnalytics ??
      googleAnalyticsSnippet ??
      null,
  };

  React.useEffect(() => {
    // Load Bootstrap JS locally (no CDN) to avoid browser tracking-prevention warnings.
    import("bootstrap");
  }, []);

  return (
    <LoadingProvider>
      <Layout {...layoutProps}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>


        <Component {...pageProps} />

        {process.env.NODE_ENV === "production" && (
          <Script
            id="cf-beacon"
            src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015"
            strategy="afterInteractive"
            integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ=="
            data-cf-beacon='{"version":"2024.11.0","token":"cd0b4b3a733644fc843ef0b185f98241","server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}'
            crossOrigin="anonymous"
          />
        )}
      </Layout>
    </LoadingProvider>
  );
}
