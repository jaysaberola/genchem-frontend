/**
 * Tab switcher for GrapesJS "Our Products" section (PVC Resins / PVC Stabilizers).
 * GrapesJS preview uses onclick="gcSwitchTab(n)" — expose on window for CMS HTML.
 */
export function gcSwitchTab(tabNumber: number): void {
  if (typeof document === "undefined") return;

  const tabIndex = Number(tabNumber);
  if (!Number.isFinite(tabIndex) || tabIndex < 1) return;

  const tabId = `tab-${tabIndex}`;
  const tabContent =
    document.getElementById("gc-tab-content") ??
    document.querySelector<HTMLElement>(".tab-content");

  if (tabContent) {
    tabContent.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("show", "active");
    });

    const target =
      document.getElementById(tabId) ??
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
}

declare global {
  interface Window {
    gcSwitchTab?: (tabNumber: number) => void;
  }
}

function resolveTabNumberFromNav(tabNav: Element, tabBtn: Element): number | null {
  const links = Array.from(
    tabNav.querySelectorAll<HTMLElement>(".nav-item > .nav-link, .nav-item > button.nav-link"),
  );
  const idx = links.indexOf(tabBtn as HTMLElement);
  if (idx >= 0) return idx + 1;

  if (tabBtn.id === "canvas-tab-2") return 2;
  if (tabBtn.id === "canvas-tab-1") return 1;

  const fromData = (tabBtn as HTMLElement).dataset.genchemTab;
  if (fromData != null) {
    const n = Number(fromData);
    if (Number.isFinite(n) && n >= 1) return n;
  }

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

  document.addEventListener("click", handleProductTabClick);
  initGenchemProductTabs();

  return () => {
    delete window.gcSwitchTab;
    document.removeEventListener("click", handleProductTabClick);
  };
}
