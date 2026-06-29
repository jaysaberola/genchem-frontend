import { useCallback, useEffect, useState } from "react";

const SCROLL_OFFSET = 450;

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_OFFSET);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("gototop-active", visible);
    return () => document.body.classList.remove("gototop-active");
  }, [visible]);

  const scrollToTop = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      id="gotoTop"
      className="genchem-goto-top rounded-circle"
      aria-label="Go to top"
      onClick={scrollToTop}
    >
      <svg
        className="genchem-goto-top__icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M6 15l6-6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
