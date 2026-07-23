const TRUST_BAR_ITEMS = [
  {
    label: "Trusted Since 1976",
    align: "",
    icon: `<svg class="me-3 genchem-trust-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="1.25em" height="1.25em" fill="currentColor" aria-hidden="true"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.1 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 2.1L288 439.1l-136.8 72.5c-8 4.2-17.9 3.8-25.3-2.1s-11.2-14.5-9.7-23.5l26.2-155.6L31.4 218c-6.4-6.4-8.6-15.9-5.9-24.5s10.3-15 19.3-16.3l153.2-22.6L266.3 13.5c4-8.3 12.4-13.5 21.6-13.5z"/></svg>`,
  },
  {
    label: "Quality Assured Products",
    align: " justify-content-lg-center",
    icon: `<svg class="me-3 genchem-trust-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1.25em" height="1.25em" fill="currentColor" aria-hidden="true"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.3-82.6-213.1-264.1-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"/></svg>`,
  },
  {
    label: "24hr Technical Support",
    align: " justify-content-lg-end",
    icon: `<svg class="me-3 genchem-trust-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.25em" height="1.25em" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.03 2 11v4c0 1.1.9 2 2 2h1v-6H4c0-4.42 3.58-8 8-8s8 3.58 8 8h-1v6h1c1.1 0 2-.9 2-2v-4c0-4.97-4.48-9-10-9z"/><path d="M5 14h2v6H5c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2zm14 0c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v-6h2z"/></svg>`,
  },
] as const;

const TRUST_BAR_ROW_HTML = `
						<div class="row gy-4">
${TRUST_BAR_ITEMS.map(
  (item) => `							<div class="col-lg-4 d-flex align-items-center${item.align}">
								${item.icon}
								<span>${item.label}</span>
							</div>`,
).join("\n")}
						</div>`;

function buildTrustBarIcon(label: string): string {
  return TRUST_BAR_ITEMS.find((item) => item.label === label)?.icon ?? TRUST_BAR_ITEMS[0].icon;
}

/** Replace GrapesJS trust bar row with inline SVG icons (no font dependency). */
export function patchHomeTrustBar(html: string): string {
  if (!html.includes("footer-stick") || !html.includes("Trusted Since 1976")) {
    return html;
  }

  return html.replace(
    /<div class="row gy-4">[\s\S]*?<span>24hr Technical Support<\/span>[\s\S]*?<\/div>(?=\s*<\/div>)/i,
    TRUST_BAR_ROW_HTML.trim(),
  );
}

export function initGenchemTrustBar(): () => void {
  if (typeof document === "undefined") return () => {};

  const trustBar = document.querySelector(".footer-stick.dark .row.gy-4");
  if (!trustBar) return () => {};

  trustBar.querySelectorAll<HTMLElement>(".col-lg-4").forEach((col) => {
    const labelEl = col.querySelector("span");
    const label = labelEl?.textContent?.trim() ?? "";
    const iconMarkup = buildTrustBarIcon(label);
    if (!iconMarkup) return;

    col.querySelectorAll("img, i, svg.genchem-trust-icon").forEach((node) => node.remove());

    if (labelEl) {
      labelEl.insertAdjacentHTML("beforebegin", iconMarkup);
    } else {
      col.insertAdjacentHTML("afterbegin", iconMarkup);
    }
  });

  return () => {};
}
