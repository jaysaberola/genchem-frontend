import Script from "next/script";

/** Theme scripts for public pages only (not loaded in admin panel). */
export default function PublicScripts() {
  return (
    <>
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/js/flatpickr.min.js" strategy="afterInteractive" />
      <Script src="/js/glightbox.min.js" strategy="afterInteractive" />
      <Script src="/js/swiper-bundle.min.js" strategy="afterInteractive" />
      <Script src="/js/swiper-custom.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
