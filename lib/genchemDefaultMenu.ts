import type { PublicMenuItem } from "@/services/publicPageService";
import { GENCHEM_PRODUCT_TABS } from "@/lib/genchemProductTabs";

/** genchemph reference navigation when CMS menu API is unavailable. */
export const GENCHEM_FALLBACK_MENU_ITEMS: PublicMenuItem[] = [
  {
    id: 1,
    label: "Home",
    type: "page",
    target: "/",
    children: [],
  },
  {
    id: 2,
    label: "About Us",
    type: "page",
    target: "/about-us",
    children: [],
  },
  {
    id: 3,
    label: "Products",
    type: "page",
    target: "/products",
    children: [
      {
        id: 31,
        label: "PVC Resins",
        type: "page",
        target: `/products#${GENCHEM_PRODUCT_TABS[0].slug}`,
        children: [],
      },
      {
        id: 32,
        label: "PVC Stabilizers",
        type: "page",
        target: `/products#${GENCHEM_PRODUCT_TABS[1].slug}`,
        children: [],
      },
    ],
  },
  {
    id: 4,
    label: "Contact Us",
    type: "page",
    target: "/contact-us",
    children: [],
  },
];
