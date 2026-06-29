import { useEffect } from "react";
import { registerGenchemTabs } from "@/lib/genchemTabs";
import { initGenchemVideos } from "@/lib/genchemMedia";
import { initGenchemContactForm } from "@/lib/genchemContactForm";
import { initGenchemTrustBar } from "@/lib/genchemTrustBar";
import { initGenchemProductCards } from "@/lib/genchemProductCards";

/** Registers global CMS helpers (tabs, video autoplay, contact form). */
export default function GenchemCmsRuntime() {
  useEffect(() => {
    const cleanupTabs = registerGenchemTabs();
    initGenchemVideos();
    const cleanupContact = initGenchemContactForm();
    const cleanupTrustBar = initGenchemTrustBar();
    const scheduleProductCards = () => {
      initGenchemProductCards();
      window.setTimeout(initGenchemProductCards, 50);
      window.setTimeout(initGenchemProductCards, 300);
    };
    scheduleProductCards();
    return () => {
      cleanupTabs();
      cleanupContact();
      cleanupTrustBar();
    };
  }, []);
  return null;
}
