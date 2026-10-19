let installedSignature: string | null = null;

/** Inject script tags from the CMS Google Analytics snippet (admin Website Settings). */
export function installGoogleAnalyticsSnippet(raw: string | null | undefined): void {
  if (typeof document === "undefined") return;

  const html = (raw ?? "").trim();
  if (!html) return;

  if (installedSignature === html) return;
  installedSignature = html;

  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll("script").forEach((oldScript) => {
    const src = oldScript.getAttribute("src");
    if (src && document.querySelector(`script[src="${CSS.escape(src)}"]`)) {
      return;
    }

    const script = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) => {
      script.setAttribute(attr.name, attr.value);
    });
    if (oldScript.textContent) {
      script.text = oldScript.textContent;
    }
    document.head.appendChild(script);
  });
}
