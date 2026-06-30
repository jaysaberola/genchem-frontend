const TRUST_BAR_ROW_HTML = `
						<div class="row gy-4">
							<div class="col-lg-4 d-flex align-items-center">
								<i class="me-3 fs-4 fa-solid fa-ranking-star" aria-hidden="true"></i>
								<span>Trusted Since 1976</span>
							</div>
							<div class="col-lg-4 d-flex align-items-center justify-content-lg-center">
								<i class="me-3 fs-4 fa-solid fa-shield-halved" aria-hidden="true"></i>
								<span>Quality Assured Products</span>
							</div>
							<div class="col-lg-4 d-flex align-items-center justify-content-lg-end">
								<i class="me-3 fs-4 fa-solid fa-headset" aria-hidden="true"></i>
								<span>24hr Technical Support</span>
							</div>
						</div>`;

/** Icons match genchemph reference (FA equivalents for Bootstrap Icons). */
export function patchHomeTrustBar(html: string): string {
  if (!html.includes("footer-stick") || !html.includes("Trusted Since 1976")) {
    return html;
  }

  return html.replace(
    /(<div\b[^>]*\bfooter-stick\b[^>]*>\s*<div class="container">)\s*<div class="row gy-4">[\s\S]*?<\/div>(\s*<\/div>\s*<\/div>)/i,
    `$1${TRUST_BAR_ROW_HTML}$2`,
  );
}

export function initGenchemTrustBar(): () => void {
  if (typeof document === "undefined") return () => {};

  const trustBar = document.querySelector(".footer-stick.dark .row.gy-4");
  if (!trustBar) return () => {};

  trustBar.querySelectorAll("img").forEach((img) => img.remove());

  const expected = [
    { label: "Trusted Since 1976", iconClass: "me-3 fs-4 fa-solid fa-ranking-star" },
    { label: "Quality Assured Products", iconClass: "me-3 fs-4 fa-solid fa-shield-halved" },
    { label: "24hr Technical Support", iconClass: "me-3 fs-4 fa-solid fa-headset" },
  ] as const;

  trustBar.querySelectorAll<HTMLElement>(".col-lg-4").forEach((col, index) => {
    const item = expected[index];
    if (!item) return;

    col.querySelectorAll("img").forEach((img) => img.remove());

    let icon = col.querySelector<HTMLElement>("i");
    if (!icon) {
      icon = document.createElement("i");
      const labelEl = col.querySelector("span");
      if (labelEl) col.insertBefore(icon, labelEl);
      else col.prepend(icon);
    }

    icon.className = item.iconClass;
    icon.setAttribute("aria-hidden", "true");
  });

  return () => {};
}
