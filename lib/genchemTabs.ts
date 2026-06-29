/**
 * Tab switcher for GrapesJS "Our Products" section (PVC Resins / PVC Stabilizers).
 * GrapesJS preview uses onclick="gcSwitchTab(n)" — expose on window for CMS HTML.
 */
import {
  GenchemProductTabSlug,
  getProductTabIndex,
  getProductTabSlug,
  isProductsPagePath,
  normalizeProductTabHash,
  parseProductTabFromHref,
  productTabHref,
} from "@/lib/genchemProductTabs";

export {
  GENCHEM_PRODUCT_TABS,
  getProductTabIndex,
  getProductTabSlug,
  isProductsPagePath,
  normalizeProductTabHash,
  parseProductTabFromHref,
  productTabHref,
} from "@/lib/genchemProductTabs";
export type { GenchemProductTabSlug } from "@/lib/genchemProductTabs";

export function gcSwitchTab(tab: number | string): void {
  if (typeof document === "undefined") return;

  const tabIndex =
    typeof tab === "number"
      ? tab
      : getProductTabIndex(tab);

  if (tabIndex == null || !Number.isFinite(tabIndex) || tabIndex < 1) return;

  const tabSlug = getProductTabSlug(tabIndex);
  const tabId = tabSlug ?? `tab-${tabIndex}`;

  const tabContent =
    document.getElementById("gc-tab-content") ??
    document.querySelector<HTMLElement>(".tab-content");

  if (tabContent) {
    tabContent.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("show", "active");
    });

    const target =
      document.getElementById(tabId) ??
      document.getElementById(`tab-${tabIndex}`) ??
      tabContent.querySelector<HTMLElement>(`#${CSS.escape(tabId)}`);

    if (target) {
      target.classList.add("show", "active");
    }
  }

  const tabNav = document.getElementById("demo-drone-tab");
  if (tabNav) {
    const links = tabNav.querySelectorAll<HTMLElement>(".nav-item > .nav-link, .nav-item > button.nav-link");
    links.forEach((link, index) => {
      const isActive = index + 1 === tabIndex;
      link.classList.toggle("active", isActive);
      link.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  const pane =
    document.getElementById(tabId) ??
    document.getElementById(`tab-${tabIndex}`);

  if (pane) {
    requestAnimationFrame(() => {
      pane.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

export function activateTabFromHash(): void {
  if (typeof document === "undefined") return;

  const slug = normalizeProductTabHash(window.location.hash);
  if (!slug) return;

  const tabNumber = getProductTabIndex(slug);
  if (tabNumber == null) return;

  if (typeof window.gcSwitchTab === "function") {
    window.gcSwitchTab(tabNumber);
    return;
  }

  gcSwitchTab(tabNumber);
}

export function navigateToProductTab(href: string): void {
  const tabNumber = parseProductTabFromHref(href);
  if (tabNumber == null) {
    window.location.href = href;
    return;
  }

  const slug = getProductTabSlug(tabNumber);
  if (!slug) {
    window.location.href = href;
    return;
  }

  const target = productTabHref(tabNumber);

  if (isProductsPagePath(window.location.pathname)) {
    window.location.href = `/public/products?t=${Date.now()}#${slug}`;
    return;
  }

  window.location.href = target;
}

declare global {
  interface Window {
    gcSwitchTab?: (tab: number | string) => void;
  }
}

function resolveTabNumberFromNav(tabNav: Element, tabBtn: Element): number | null {
  const links = Array.from(
    tabNav.querySelectorAll<HTMLElement>(".nav-item > .nav-link, .nav-item > button.nav-link"),
  );
  const idx = links.indexOf(tabBtn as HTMLElement);
  if (idx >= 0) return idx + 1;

  const fromData = (tabBtn as HTMLElement).dataset.genchemTab;
  if (fromData) {
    const fromSlug = getProductTabIndex(fromData);
    if (fromSlug != null) return fromSlug;
  }

  if (tabBtn.id === "canvas-tab-2") return 2;
  if (tabBtn.id === "canvas-tab-1") return 1;

  return null;
}

function handleProductTabClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const tabNav = target.closest("#demo-drone-tab");
  if (!tabNav) return;

  const tabBtn = target.closest(".nav-link, button.nav-link");
  if (!tabBtn || !tabNav.contains(tabBtn)) return;

  const tabNumber = resolveTabNumberFromNav(tabNav, tabBtn);
  if (tabNumber == null) return;

  event.preventDefault();
  gcSwitchTab(tabNumber);
}

export function initGenchemProductTabs(): void {
  const tabNav = document.getElementById("demo-drone-tab");
  if (!tabNav) return;

  tabNav.querySelectorAll<HTMLButtonElement>(".nav-link, button.nav-link").forEach((btn) => {
    btn.type = "button";
  });
}

export function registerGenchemTabs(): () => void {
  window.gcSwitchTab = gcSwitchTab;

  document.addEventListener("click", handleProductTabClick, true);
  initGenchemProductTabs();

  return () => {
    delete window.gcSwitchTab;
    document.removeEventListener("click", handleProductTabClick, true);
  };
}
