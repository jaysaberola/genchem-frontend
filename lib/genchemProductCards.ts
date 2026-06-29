const HOVER_SCALE = "scale(0.9)";

function bindProductImageHover(img: HTMLImageElement, link: HTMLAnchorElement | null): void {
  if (img.dataset.genchemHoverBound === "1") return;
  img.dataset.genchemHoverBound = "1";

  const onEnter = () => {
    img.style.setProperty("transform", HOVER_SCALE, "important");
  };
  const onLeave = () => {
    img.style.removeProperty("transform");
  };

  for (const el of link ? [img, link] : [img]) {
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
  }
}

/** Apply genchemph reference product bag overlap (curve box + image outside border). */
export function initGenchemProductCards(root: ParentNode = document): void {
  const cards = root.querySelectorAll<HTMLElement>(
    ".bg-dark-red .border-2-white.position-relative, .bg-dark-red .rounded-lg.border-2-white",
  );

  cards.forEach((card) => {
    const row = card.parentElement;
    if (!row) return;

    const siblings = Array.from(row.children).filter((el) =>
      el.classList.contains("border-2-white"),
    );
    const index = siblings.indexOf(card);
    const isRightImage = index % 2 === 1;

    card.classList.add("width-img-control");

    const link = card.querySelector<HTMLAnchorElement>("a");
    if (link) {
      link.style.position = "absolute";
      link.style.bottom = "0";
      link.style.zIndex = "5";
      link.style.display = "block";
      link.style.lineHeight = "0";
      link.style.textDecoration = "none";
      link.style.pointerEvents = "auto";
    }

    const img = card.querySelector<HTMLImageElement>("img");
    if (!img) return;

    const inline = img.getAttribute("style") || "";
    const rightFromInline = /right\s*:\s*-?\d/i.test(inline);
    const leftFromInline = /left\s*:\s*-?\d/i.test(inline);
    const placeRight = rightFromInline || (!leftFromInline && isRightImage);

    img.classList.add("-hover-scale");
    bindProductImageHover(img, link);
    img.style.position = "absolute";
    img.style.bottom = "-3px";
    img.style.maxWidth = "340px";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.zIndex = "4";
    img.style.background = "transparent";
    img.style.cursor = "pointer";
    img.style.pointerEvents = "auto";
    img.style.transformOrigin = "center bottom";
    img.style.transition = "transform 0.4s ease";

    if (placeRight) {
      if (link) link.style.right = "-100px";
      img.style.right = "-100px";
      img.style.left = "auto";
    } else {
      if (link) link.style.left = "-95px";
      img.style.left = "-95px";
      img.style.right = "auto";
    }
  });
}
