import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug } from "@/services/publicPageService";
import { getPublicArticles, getCategories, getArchive } from "@/services/articleService";
import LeftSidebar from "@/components/News/LeftSidebar";
import NewsCategoryTabs from "@/components/News/NewsCategoryTabs";
import NewsGrid from "@/components/News/NewsGrid";
import {
  buildNewsCategoryTabs,
  getActiveCategoryId,
  resolveNewsFilterQuery,
} from "@/lib/newsQuery";

type Props = {
  pageData: any;
  articles: any[];
  categories: any[];
  archives: Record<string, { month: number; total: number }[]>;
  totalArticles: number;
  activeCategoryId: number | "all" | "uncategorized";
  activeLabel: string;
};

export default function NewsPage({
  articles,
  categories,
  archives,
  totalArticles,
  activeCategoryId,
  activeLabel,
}: Props) {
  const tabs = buildNewsCategoryTabs(categories, totalArticles);

  return (
    <div className="container genchem-news-page">
      <div className="genchem-news-shell">
        <div className="genchem-news-header">
          <small className="text-secondary">GENCHEM PH</small>
          <h1>{activeLabel === "All News" ? "News" : activeLabel}</h1>
        </div>

        <NewsCategoryTabs categories={tabs} activeId={activeCategoryId} />

        <div className="genchem-news-body">
          <aside className="genchem-news-sidebar">
            <LeftSidebar
              categories={categories}
              archive={archives}
              activeCategoryId={activeCategoryId}
            />
          </aside>

          <section className="genchem-news-main">
            <NewsGrid articles={articles} />
          </section>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }: any) {
  try {
    const [categoriesRes, archiveRes] = await Promise.all([
      getCategories(),
      getArchive(),
    ]);

    let pageData = null;
    try {
      const pageRes = await getPublicPageBySlug("news");
      pageData = pageRes.data ?? null;
    } catch (pageError) {
      console.warn("News CMS page not found, using defaults.", pageError);
      pageData = { title: "News", slug: "news" };
    }

    const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
    const archives = archiveRes.data ?? {};
    const filters = resolveNewsFilterQuery(query, categories);

    if (query.type) {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.category_id != null) {
        params.set("category_id", String(filters.category_id));
      }
      if (filters.year) params.set("year", String(filters.year));
      if (filters.month) params.set("month", String(filters.month));

      const qs = params.toString();
      return {
        redirect: {
          destination: qs ? `/public/news?${qs}` : "/public/news",
          permanent: false,
        },
      };
    }

    const [articlesRes, allArticlesRes] = await Promise.all([
      getPublicArticles({
        search: filters.search || undefined,
        category: filters.category || undefined,
        category_id:
          filters.category_id != null ? filters.category_id : undefined,
        year: filters.year || undefined,
        month: filters.month || undefined,
        per_page: 12,
      }),
      getPublicArticles({ per_page: 1 }),
    ]);

    const articles = Array.isArray(articlesRes.data?.data)
      ? articlesRes.data.data
      : Array.isArray(articlesRes.data)
        ? articlesRes.data
        : [];

    const totalArticles = allArticlesRes.data?.total ?? articles.length;
    const activeCategoryId = getActiveCategoryId(filters, categories);

    let activeLabel = "All News";
    if (activeCategoryId === "uncategorized") {
      activeLabel = "Uncategorized";
    } else if (typeof activeCategoryId === "number") {
      activeLabel =
        categories.find((category: any) => category.id === activeCategoryId)?.name ||
        "News";
    }

    return {
      props: {
        pageData,
        articles,
        categories,
        archives,
        totalArticles,
        activeCategoryId,
        activeLabel,
      },
    };
  } catch (error: any) {
    console.error("NEWS SSR ERROR:", error?.response?.data || error);
    return {
      props: {
        pageData: { title: "News", slug: "news" },
        articles: [],
        categories: [],
        archives: {},
        totalArticles: 0,
        activeCategoryId: "all",
        activeLabel: "All News",
      },
    };
  }
}

NewsPage.Layout = LandingPageLayout;
