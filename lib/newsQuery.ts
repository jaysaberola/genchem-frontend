export type NewsFilterQuery = {
  search?: string | null;
  category?: string | null;
  category_id?: number | null;
  year?: string | null;
  month?: string | null;
};

export type NewsCategoryOption = {
  id: number;
  name: string;
  slug: string;
  articles_count?: number;
};

export function resolveNewsFilterQuery(
  query: Record<string, string | string[] | undefined>,
  categories: NewsCategoryOption[] = []
): NewsFilterQuery {
  const pick = (key: string) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };

  let search = pick("search") ?? null;
  let category = pick("category") ?? null;
  let category_id = pick("category_id") ? Number(pick("category_id")) : null;
  let year = pick("year") ?? null;
  let month = pick("month") ?? null;

  const legacyType = pick("type");
  const legacyCriteria = pick("criteria");

  if (legacyType === "searchbox" && legacyCriteria) {
    search = legacyCriteria;
  }

  if (legacyType === "month" && legacyCriteria) {
    const [legacyYear, legacyMonth] = legacyCriteria.split("-");
    year = legacyYear || null;
    month = legacyMonth || null;
  }

  if (legacyType === "category" && legacyCriteria !== undefined) {
    const criteriaId = Number(legacyCriteria);
    if (criteriaId === 0) {
      category = null;
      category_id = 0;
    } else {
      const match = categories.find((item) => item.id === criteriaId);
      category = match?.slug ?? null;
      category_id = Number.isFinite(criteriaId) ? criteriaId : null;
    }
  }

  return {
    search,
    category,
    category_id: Number.isFinite(category_id as number) ? category_id : null,
    year,
    month,
  };
}

export function getActiveCategoryId(
  filters: NewsFilterQuery,
  categories: NewsCategoryOption[],
): number | "all" | "uncategorized" {
  if (filters.category_id === 0 || filters.category === "uncategorized") {
    return "uncategorized";
  }

  if (filters.category_id) {
    return filters.category_id === 0 ? "uncategorized" : filters.category_id;
  }

  if (filters.category) {
    const match = categories.find((item) => item.slug === filters.category);
    if (match) {
      return match.id === 0 ? "uncategorized" : match.id;
    }
  }

  if (!filters.search && !filters.year && !filters.month) {
    return "all";
  }

  return "all";
}

export function buildNewsCategoryTabs(
  categories: NewsCategoryOption[],
  totalArticles: number,
) {
  const tabs: Array<{
    id: number | "all" | "uncategorized";
    name: string;
    slug?: string;
    articles_count?: number;
  }> = [
    {
      id: "all",
      name: "All News",
      articles_count: totalArticles,
    },
  ];

  categories.forEach((category) => {
    tabs.push({
      id: category.id === 0 ? "uncategorized" : category.id,
      name: category.name,
      slug: category.slug,
      articles_count: category.articles_count ?? 0,
    });
  });

  return tabs;
}

export function isLegacyPublicNewsQuery(query: Record<string, string | string[] | undefined>) {
  const type = Array.isArray(query.type) ? query.type[0] : query.type;
  return type === "category" || type === "month" || type === "searchbox";
}

export function buildLegacyNewsRedirect(query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    const normalized = Array.isArray(value) ? value[0] : value;
    if (normalized != null && normalized !== "") {
      params.set(key, normalized);
    }
  });

  const qs = params.toString();
  return qs ? `/public/news?${qs}` : "/public/news";
}
