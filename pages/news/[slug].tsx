import PublicNewsArticlePage, {
  getServerSideProps as publicNewsGetServerSideProps,
} from "../public/news/[slug]";

/** Admin routes under `/news/*` (handled by other page files). */
const ADMIN_NEWS_SLUGS = new Set([
  "create",
  "category_index",
  "category_create",
  "edit",
  "index",
]);

export default PublicNewsArticlePage;

export async function getServerSideProps(context: Parameters<typeof publicNewsGetServerSideProps>[0]) {
  const raw = context.params?.slug;
  const slug = Array.isArray(raw) ? raw[0] : raw;

  if (slug && ADMIN_NEWS_SLUGS.has(slug)) {
    return { notFound: true };
  }

  return publicNewsGetServerSideProps(context);
}
