export type MenuItemType = "page" | "url";

export type Page = {
  id: number;
  title: string;
  slug: string;
};

export type MenuItem = {
  id: number;
  label: string;
  type: MenuItemType;
  target?: string; // URL for custom links
  children: MenuItem[];
};

export type FlatItem = {
  id: number;
  label: string;
  type: MenuItemType;
  target?: string;
  depth: number;
  parentId: number | null;
};
