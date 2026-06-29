const TRUST_SHIELD_ICON_HTML =
  '<i class="me-3 fs-4 fa-solid fa-shield-halved" aria-hidden="true"></i>';

const SHIELD_ICON_CLASS = "me-3 fs-4 fa-solid fa-shield-halved";

function columnHasShieldIcon(columnHtml: string): boolean {
  return /fa-shield-halved|fa-shield\b|fa-award|fa-certificate/i.test(columnHtml);
}

function columnHasAnyIcon(columnHtml: string): boolean {
  return /<i\b/i.test(columnHtml);
}

/** Trust bar — Font Awesome shield for middle item (matches left/right icons). */
export function patchHomeTrustBar(html: string): string {
  if (!html.includes("Quality Assured Products")) return html;

  let output = html;

  output = output.replace(/<i\b[^>]*\bbi-shield[^>]*>\s*<\/i>/gi, TRUST_SHIELD_ICON_HTML);

  output = output.replace(
    /(<div\b[^>]*>)(\s*)<i\b[^>]*>\s*<\/i>(\s*<span[^>]*>\s*Quality Assured Products\s*<\/span>)/gi,
    `$1$2${TRUST_SHIELD_ICON_HTML}$3`,
  );

  output = output.replace(
    /(<div\b[^>]*\bcol-(?:lg|md)-4\b[^>]*>)([\s\S]*?)(<span[^>]*>\s*Quality Assured Products\s*<\/span>)/gi,
    (match, open, middle, span) => {
      if (columnHasShieldIcon(match)) return match;
      if (columnHasAnyIcon(middle)) {
        return `${open}${middle.replace(/<i\b[^>]*>\s*<\/i>/i, TRUST_SHIELD_ICON_HTML)}${span}`;
      }
      return `${open}${middle}${TRUST_SHIELD_ICON_HTML}${span}`;
    },
  );

  return output;
}

export function initGenchemTrustBar(): () => void {
  if (typeof document === "undefined") return () => {};

  document.querySelectorAll(".footer-stick.dark").forEach((bar) => {
    bar.querySelectorAll<HTMLElement>('[class*="col-lg-4"], [class*="col-md-4"]').forEach((col) => {
      if (!col.textContent?.includes("Quality Assured Products")) return;

      const existing = col.querySelector<HTMLElement>("i");
      if (existing) {
        if (!/fa-shield|fa-award|fa-certificate/i.test(existing.className)) {
          existing.className = SHIELD_ICON_CLASS;
          existing.setAttribute("aria-hidden", "true");
        }
        return;
      }

      const icon = document.createElement("i");
      icon.className = SHIELD_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");

      const label = col.querySelector("span");
      if (label) {
        col.insertBefore(icon, label);
      } else {
        col.prepend(icon);
      }
    });
  });

  return () => {};
}
