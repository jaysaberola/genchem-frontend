import Link from "next/link";

export type NewsCategoryTab = {
  id: number | "all" | "uncategorized";
  name: string;
  slug?: string;
  articles_count?: number;
};

type Props = {
  categories: NewsCategoryTab[];
  activeId?: number | "all" | "uncategorized";
};

function buildHref(category: NewsCategoryTab): string {
  if (category.id === "all") return "/public/news";
  if (category.id === "uncategorized") {
    return "/public/news?category_id=0";
  }
  if (category.slug) return `/public/news?category=${encodeURIComponent(category.slug)}`;
  return `/public/news?category_id=${category.id}`;
}

function isActive(category: NewsCategoryTab, activeId?: number | "all" | "uncategorized") {
  if (!activeId) return category.id === "all";
  return category.id === activeId;
}

export default function NewsCategoryTabs({ categories, activeId }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="genchem-news-tabs-wrap">
      <ul className="genchem-news-tabs">
        {categories.map((category) => {
          const active = isActive(category, activeId);
          return (
            <li key={String(category.id)} className="genchem-news-tab">
              <Link
                href={buildHref(category)}
                className={`genchem-news-tab-link${active ? " active" : ""}`}
              >
                <span>{category.name}</span>
                {typeof category.articles_count === "number" ? (
                  <span className="genchem-news-tab-count">{category.articles_count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
