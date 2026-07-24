import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicMenuItem } from "@/services/publicPageService";
import { navigateToProductTab, parseProductTabFromHref } from "@/lib/genchemTabs";
import { getProductTabSlug, normalizeProductTabHash } from "@/lib/genchemProductTabs";

const MOBILE_MENU_QUERY = "(max-width: 991px)";

function normalizePath(url: string): string {
  try {
    return new URL(url, "http://local").pathname;
  } catch {
    return url;
  }
}

function isProductTabLinkActive(childTarget: string, currentPath: string): boolean {
  const tabNumber = parseProductTabFromHref(childTarget);
  if (tabNumber == null) {
    return normalizePath(currentPath) === normalizePath(childTarget);
  }

  if (normalizePath(currentPath) !== "/public/products") return false;

  const hashPart = currentPath.includes("#") ? currentPath.slice(currentPath.indexOf("#")) : "";
  const activeSlug = normalizeProductTabHash(hashPart);
  const childSlug = getProductTabSlug(tabNumber);

  if (activeSlug && childSlug) return activeSlug === childSlug;
  return tabNumber === 1;
}

export default function MenuItem({
  item,
  currentPath,
  isMobile = false,
  onNavigate,
}: {
  item: PublicMenuItem;
  currentPath: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(MOBILE_MENU_QUERY);
    const sync = () => setIsMobileViewport(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const href = item.target;
  const isInternal = item.type === "page";
  const hasChildren = item.children && item.children.length > 0;
  const useMobileSubmenu = isMobile && isMobileViewport && hasChildren;

  const hrefPath = normalizePath(href);
  const isCurrent =
    isInternal &&
    (currentPath === hrefPath || currentPath.startsWith(hrefPath + "/"));

  const isChildCurrent = hasChildren && normalizePath(currentPath) === normalizePath(href);

  const isHighlighted = isCurrent || isChildCurrent;

  const handleParentToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (useMobileSubmenu) {
      handleParentToggle(e);
      return;
    }
    if (isMobile) onNavigate?.();
  };

  const handleChildClick = (e: React.MouseEvent, childTarget: string) => {
    const tabNumber = parseProductTabFromHref(childTarget);
    if (tabNumber != null) {
      e.preventDefault();
      navigateToProductTab(childTarget);
    }
    if (isMobile) onNavigate?.();
  };

  const linkClassName = `menu-link fs-5 ${isHighlighted ? "active" : ""}`;
  const linkStyle = { textDecoration: "none" } as const;

  const parentLabel = <div>{item.label}</div>;

  return (
    <li className={`menu-item ${isHighlighted ? "current" : ""} ${open ? "open" : ""}`}>
      {useMobileSubmenu ? (
        <button
          type="button"
          className={`${linkClassName} genchem-menu-toggle`}
          style={linkStyle}
          aria-expanded={open}
          onClick={handleParentToggle}
        >
          {parentLabel}
        </button>
      ) : isInternal ? (
        <Link href={href} className={linkClassName} style={linkStyle} onClick={handleLinkClick}>
          {parentLabel}
        </Link>
      ) : (
        <a
          href={href}
          className={linkClassName}
          style={linkStyle}
          rel="noopener noreferrer"
          onClick={handleLinkClick}
        >
          {parentLabel}
        </a>
      )}

      {hasChildren && (
        <ul className="sub-menu-container border-0">
          {item.children!.map((child) => (
            <li key={`${child.id}-${child.target}`} className="menu-item">
              {child.type === "page" ? (
                <Link
                  href={child.target}
                  className={`menu-link ${isProductTabLinkActive(child.target, currentPath) ? "active" : ""}`}
                  style={{ textDecoration: "none" }}
                  onClick={(e) => handleChildClick(e, child.target)}
                >
                  <div>{child.label}</div>
                </Link>
              ) : (
                <a
                  href={child.target}
                  className="menu-link"
                  style={{ textDecoration: "none" }}
                  rel="noopener noreferrer"
                  onClick={(e) => handleChildClick(e, child.target)}
                >
                  <div>{child.label}</div>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
