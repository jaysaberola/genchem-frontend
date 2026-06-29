import type { PublicMenuItem } from "@/services/publicPageService";
import { GENCHEM_PRODUCT_TABS } from "@/lib/genchemProductTabs";

/** genchemph reference navigation when CMS menu API is unavailable. */
export const GENCHEM_FALLBACK_MENU_ITEMS: PublicMenuItem[] = [
  {
    id: 1,
    label: "Home",
    type: "page",
    target: "/public/home",
    children: [],
  },
  {
    id: 2,
    label: "About Us",
    type: "page",
    target: "/public/about-us",
    children: [],
  },
  {
    id: 3,
    label: "Products",
    type: "page",
    target: "/public/products",
    children: [
      {
        id: 31,
        label: "PVC Resins",
        type: "page",
        target: `/public/products#${GENCHEM_PRODUCT_TABS[0].slug}`,
        children: [],
      },
      {
        id: 32,
        label: "PVC Stabilizers",
        type: "page",
        target: `/public/products#${GENCHEM_PRODUCT_TABS[1].slug}`,
        children: [],
      },
    ],
  },
  {
    id: 4,
    label: "Contact Us",
    type: "page",
    target: "/public/contact-us",
    children: [],
  },
];
