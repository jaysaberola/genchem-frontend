import { useState } from "react";
import Link from "next/link";
import { PublicMenuItem } from "@/services/publicPageService";

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

  const normalizePath = (url: string) => {
    try {
      return new URL(url, "http://local").pathname;
    } catch {
      return url;
    }
  };

  const hrefPath = normalizePath(href);
  const isCurrent =
    isInternal &&
    (currentPath === hrefPath || currentPath.startsWith(hrefPath + "/"));

  const isChildCurrent =
    hasChildren &&
    item.children!.some((child) => {
      const childPath = normalizePath(child.target);
      return currentPath === childPath || currentPath.startsWith(childPath + "/");
    });

  const isHighlighted = isCurrent || isChildCurrent;

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isMobile && hasChildren) {
      e.preventDefault();
      setOpen((prev) => !prev);
      return;
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
            <MenuItem
              key={child.id}
              item={child}
              currentPath={currentPath}
              isMobile={isMobile}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
