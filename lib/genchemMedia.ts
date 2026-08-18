const DRONE_VIDEO_SRC = "/images/genchemph/genchem_video.mp4?v=20260818";

/** Strip GrapesJS placeholder src on background videos so the site mp4 plays. */
export function fixCmsDroneVideos(html: string): string {
  if (!html || !html.includes("video-wrap")) return html;

  let output = html.replace(/<video\b([^>]*)>/gi, (_match, attrs: string) => {
    let cleaned = attrs
      .replace(/\ssrc=(["'])data:[^"']*\1/gi, "")
      .replace(/\sposter=(["'][^"']*["'])/gi, "")
      .replace(/\scontrols=(["'][^"']*["'])/gi, "")
      .replace(/\scontrols\b/gi, "")
      .replace(/\sallowfullscreen=(["'][^"']*["'])/gi, "")
      .replace(/\sallowfullscreen\b/gi, "");

    if (!/\bautoplay\b/i.test(cleaned)) cleaned += " autoplay";
    if (!/\bmuted\b/i.test(cleaned)) cleaned += " muted";
    if (!/\bloop\b/i.test(cleaned)) cleaned += " loop";
    if (!/\bplaysinline\b/i.test(cleaned)) cleaned += " playsinline";
    if (!/\bpreload\b/i.test(cleaned)) cleaned += ' preload="auto"';

    return `<video${cleaned}>`;
  });

  output = output.replace(
    /(<source\b[^>]*\ssrc=)(["'])([^"']+)\2/gi,
    (_match, prefix: string, quote: string, src: string) => {
      if (src.includes("video.mp4") || src.includes("genchem_video") || src.includes("images/video")) {
        return `${prefix}${quote}${DRONE_VIDEO_SRC}${quote}`;
      }
      return _match;
    },
  );

  return output;
}

function prepareDroneVideoElement(video: HTMLVideoElement): void {
  const directSrc = video.getAttribute("src") || "";
  if (directSrc.startsWith("data:") || directSrc.includes("svg+xml")) {
    video.removeAttribute("src");
  }

  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.autoplay = true;
  video.controls = false;
  video.setAttribute("playsinline", "");
  video.removeAttribute("controls");
  video.removeAttribute("poster");
  video.preload = "auto";

  let source = video.querySelector("source");
  if (!source) {
    source = document.createElement("source");
    source.type = "video/mp4";
    video.appendChild(source);
  }

  source.src = DRONE_VIDEO_SRC;
  source.setAttribute("type", "video/mp4");
}

/** Autoplay muted CMS background videos (genchemph home section). */
export function initGenchemVideos(root: ParentNode = document): void {
  root.querySelectorAll<HTMLVideoElement>(".video-wrap video").forEach((video) => {
    prepareDroneVideoElement(video);

    void video.load();
    void video.play().catch(() => {
      /* autoplay may be blocked until user interaction */
    });
  });
}

/** @deprecated Import from @/lib/genchemTabs */
export { activateTabFromHash } from "@/lib/genchemTabs";
