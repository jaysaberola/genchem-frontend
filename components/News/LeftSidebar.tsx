import { useRouter } from "next/router";
import { useState } from "react";
import SearchIcon from "../icons/search";

type Props = {
  categories: any[];
  archive: Record<string, { month: number; total: number }[]>;
  activeCategoryId?: number | "all" | "uncategorized";
};

const MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function LeftSidebar({ categories, archive, activeCategoryId }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(
    (router.query.search as string) || ""
  );

  const pushQuery = (params: Record<string, string | number | null | undefined>) => {
    const nextQuery = { ...router.query, ...params };

    Object.keys(nextQuery).forEach((key) => {
      const value = nextQuery[key];
      if (value === null || value === undefined || value === "") {
        delete nextQuery[key];
      }
    });

    delete nextQuery.type;
    delete nextQuery.criteria;

    router.push({
      pathname: "/public/news",
      query: nextQuery,
    });
  };

  const isCategoryActive = (category: any) => {
    if (activeCategoryId === "uncategorized") {
      return category.id === 0 || category.slug === "uncategorized";
    }
    if (typeof activeCategoryId === "number") {
      return category.id === activeCategoryId;
    }
    return false;
  };

  return (
    <>
      <div className="genchem-news-search">
        <input
          type="text"
          placeholder="Search news"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              pushQuery({
                search,
                category: null,
                category_id: null,
                year: null,
                month: null,
              });
            }
          }}
        />
        <button
          type="button"
          aria-label="Search news"
          onClick={() =>
            pushQuery({
              search,
              category: null,
              category_id: null,
              year: null,
              month: null,
            })
          }
        >
          <SearchIcon />
        </button>
      </div>

      {categories.length > 0 && (
        <div className="genchem-news-sidebar-section">
          <h4 className="genchem-news-sidebar-title">Categories</h4>
          <ul className="genchem-news-sidebar-list">
            <li className="genchem-news-sidebar-item">
              <button
                type="button"
                className={`genchem-news-sidebar-link${activeCategoryId === "all" ? " active" : ""}`}
                onClick={() =>
                  pushQuery({
                    search: null,
                    category: null,
                    category_id: null,
                    year: null,
                    month: null,
                  })
                }
              >
                <span>All News</span>
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="genchem-news-sidebar-item">
                <button
                  type="button"
                  className={`genchem-news-sidebar-link${isCategoryActive(cat) ? " active" : ""}`}
                  onClick={() =>
                    pushQuery(
                      cat.id === 0
                        ? {
                            search: null,
                            category: null,
                            category_id: 0,
                            year: null,
                            month: null,
                          }
                        : {
                            search: null,
                            category: cat.slug,
                            category_id: null,
                            year: null,
                            month: null,
                          }
                    )
                  }
                >
                  <span>{cat.name}</span>
                  {typeof cat.articles_count === "number" ? (
                    <span className="genchem-news-tab-count">{cat.articles_count}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(archive).length > 0 && (
        <div className="genchem-news-sidebar-section">
          <h4 className="genchem-news-sidebar-title">Archive</h4>
          <ul className="genchem-news-sidebar-list">
            {Object.entries(archive).map(([year, months]) =>
              months.map((m) => (
                <li key={`${year}-${m.month}`} className="genchem-news-sidebar-item">
                  <button
                    type="button"
                    className="genchem-news-sidebar-link"
                    onClick={() =>
                      pushQuery({
                        search: null,
                        category: null,
                        category_id: null,
                        year,
                        month: m.month,
                      })
                    }
                  >
                    <span>
                      {MONTHS[m.month]} {year}
                    </span>
                    <span className="genchem-news-tab-count">{m.total}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
}
