import { useCallback, useEffect, useRef, useState } from "react";

const ANIMATION_MS = 1000;

export function normalizeAnimationClass(
  value?: string | number | null,
  fallback = "fadeIn",
): string {
  if (value === null || value === undefined) return fallback;
  const raw = String(value).trim();
  if (!raw || /^\d+$/.test(raw)) return fallback;
  return raw;
}

export function useBannerCarousel(
  count: number,
  intervalSeconds = 5,
  transitionIn?: string | number | null,
  transitionOut?: string | number | null,
) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<"idle" | "transition">("idle");
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(0);
  const animatingRef = useRef(false);
  const currentRef = useRef(0);

  const inClass = normalizeAnimationClass(transitionIn, "fadeIn");
  const outClass = normalizeAnimationClass(transitionOut, "fadeOut");
  const intervalMs = Math.max(Number(intervalSeconds) || 5, 1) * 1000;

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      if (phase === "transition" || animatingRef.current) return;
      if (next === currentRef.current) return;

      animatingRef.current = true;
      setFromIndex(currentRef.current);
      setToIndex(next);
      setPhase("transition");

      window.setTimeout(() => {
        setCurrent(next);
        setPhase("idle");
        window.setTimeout(() => {
          animatingRef.current = false;
        }, ANIMATION_MS);
      }, ANIMATION_MS);
    },
    [count, phase],
  );

  useEffect(() => {
    if (count <= 1) return;

    const timer = window.setInterval(() => {
      goTo((currentRef.current + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [count, intervalMs, goTo]);

  const isSlideVisible = (index: number) => {
    if (phase === "transition") {
      return index === fromIndex || index === toIndex;
    }
    return index === current;
  };

  const getSlideAnimationClass = (index: number) => {
    if (phase !== "transition") return "";
    if (index === fromIndex) return `animated ${outClass}`;
    if (index === toIndex) return `animated ${inClass}`;
    return "";
  };

  const getSlideZIndex = (index: number) => {
    if (phase === "transition") {
      if (index === toIndex) return 2;
      if (index === fromIndex) return 1;
      return 0;
    }
    return index === current ? 2 : 0;
  };

  return {
    current,
    goTo,
    isSlideVisible,
    getSlideAnimationClass,
    getSlideZIndex,
  };
}
