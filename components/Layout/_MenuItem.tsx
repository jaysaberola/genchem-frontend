import { useState } from "react";
import Link from "next/link";
import { PublicMenuItem } from "@/services/publicPageService";
import { navigateToProductTab, parseProductTabFromHref } from "@/lib/genchemTabs";
import { getProductTabSlug, normalizeProductTabHash } from "@/lib/genchemProductTabs";

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

  const href = item.target;
  const isInternal = item.type === "page";
  const hasChildren = item.children && item.children.length > 0;

  const hrefPath = normalizePath(href);
  const isCurrent =
    isInternal &&
    (currentPath === hrefPath || currentPath.startsWith(hrefPath + "/"));

  const isChildCurrent = hasChildren && normalizePath(currentPath) === normalizePath(href);

  const isHighlighted = isCurrent || isChildCurrent;

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isMobile && hasChildren) {
      e.preventDefault();
      setOpen((prev) => !prev);
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

  const linkProps = {
    className: `menu-link fs-5 ${isHighlighted ? "active" : ""}`,
    style: { textDecoration: "none" } as const,
    onClick: handleLinkClick,
  };

  return (
    <li className={`menu-item ${isHighlighted ? "current" : ""} ${open ? "open" : ""}`}>
      {isInternal ? (
        <Link href={href} {...linkProps}>
          <div>{item.label}</div>
        </Link>
      ) : (
        <a href={href} {...linkProps} rel="noopener noreferrer">
          <div>{item.label}</div>
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
