import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getActiveMenu, PublicMenu, PublicMenuItem } from "@/services/publicPageService";
import { GENCHEM_FALLBACK_MENU_ITEMS } from "@/lib/genchemDefaultMenu";
import { GENCHEM_PRODUCT_TABS } from "@/lib/genchemProductTabs";
import MenuItem from "./_MenuItem";

function normalizeMenuItems(items: PublicMenuItem[] | undefined): PublicMenuItem[] {
  if (!items?.length) return GENCHEM_FALLBACK_MENU_ITEMS;

  return items.map((item) => {
    if (item.label !== "Products") return item;

    const children = item.children?.length
      ? item.children.map((child, index) => ({
          ...child,
          label:
            child.label === "Products"
              ? index === 0
                ? "PVC Resins"
                : "PVC Stabilizers"
              : child.label,
          target: `/public/products#${GENCHEM_PRODUCT_TABS[index]?.slug ?? (index === 0 ? "pvc-resins" : "pvc-stabilizers")}`,
        }))
      : GENCHEM_FALLBACK_MENU_ITEMS.find((m) => m.label === "Products")?.children ?? [];

    return { ...item, children };
  });
}

export default function Menu({
  isMobile = false,
  onNavigate,
}: {
  isMobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<PublicMenuItem[]>(GENCHEM_FALLBACK_MENU_ITEMS);

  useEffect(() => {
    getActiveMenu()
      .then((res) => {
        const menu = res.data.data as PublicMenu | null;
        setItems(normalizeMenuItems(menu?.items));
      })
      .catch(() => {
        setItems(GENCHEM_FALLBACK_MENU_ITEMS);
      });
  }, []);

  return (
    <>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          currentPath={router.asPath}
          isMobile={isMobile}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}
