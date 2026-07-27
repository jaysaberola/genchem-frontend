import Link from "next/link";

const FALLBACK_IMAGE = "/images/genchemph/banners/HOMEPAGE_ABOUT_US.png";

type Props = {
  articles: any[];
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NewsGrid({ articles }: Props) {
  if (!articles.length) {
    return (
      <div className="genchem-news-empty">
        <p className="mb-0">No news articles found for this category.</p>
      </div>
    );
  }

  return (
    <div className="genchem-news-grid">
      {articles.map((article) => {
        const image =
          article.thumbnail_url ||
          article.image_url ||
          FALLBACK_IMAGE;

        return (
          <article key={article.id} className="genchem-news-card">
            <Link href={`/public/news/${article.slug}`} className="genchem-news-card-image">
              <img src={image} alt={article.name} loading="lazy" decoding="async" />
            </Link>

            <div className="genchem-news-card-body">
              <div className="genchem-news-card-meta">
                <span>{formatDate(article.date)}</span>
                {article.category?.name ? <span>{article.category.name}</span> : null}
              </div>

              <h3 className="genchem-news-card-title">
                <Link href={`/public/news/${article.slug}`}>{article.name}</Link>
              </h3>

              {article.teaser ? (
                <p className="genchem-news-card-excerpt">{article.teaser}</p>
              ) : null}

              <Link href={`/public/news/${article.slug}`} className="genchem-news-card-action">
                Read More
                <i className="fa fa-angle-right" aria-hidden="true" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
