import Head from "next/head";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getArticleBySlug } from "@/services/articleService";
import { articleToAlbum } from "@/schemas/articleToAlbum";

type Props = {
  pageData: any;
  article: any;
};

export default function NewsDetailPage({ article }: Props) {
  // Parse the grapesjs json to extract css and js if needed
  let gjsCSS = "";
  let gjsJS = "";

  try {
    if (article.json) {
      const parsed = typeof article.json === "string" ? JSON.parse(article.json) : article.json;
      gjsCSS = parsed["gjs-css"] || "";
      gjsJS = parsed["gjs-js"] || "";
    }
  } catch (e) {
    console.warn("Failed to parse article.json", e);
  }

  // Merge styles: prefer article.styles, fallback to parsed gjs-css
  const finalCSS = article.styles || gjsCSS || "";

  return (
    <>
      <Head>
        <title>{article.meta_title || article.name}</title>
        <meta
          name="description"
          content={article.meta_description || article.teaser}
        />
        {/* Inject GrapesJS styles in <head> */}
        {finalCSS && (
          <style
            dangerouslySetInnerHTML={{ __html: finalCSS }}
          />
        )}
      </Head>

      <div className="container">
        {/* TITLE */}
        <h1 className="fw-bold text-primary mb-2">
          {article.name}
        </h1>

        {/* META */}
        <div className="text-muted small mb-4">
          Posted on {article.date}
          {article.user?.firstname && (
            <> &nbsp;|&nbsp; By {article.user.firstname} {article.user.lastname}</>
          )}
          {article.category?.name && <> &nbsp;|&nbsp; {article.category.name}</>}
        </div>

        {/* FEATURED IMAGE */}
        {(article.thumbnail_url || article.image_url) && (
          <div className="mb-5 text-center">
            <img
              src={article.thumbnail_url || article.image_url}
              alt={article.name}
              className="img-fluid rounded"
              style={{ maxWidth: "500px" }}
            />
          </div>
        )}

        {/* GRAPESJS CONTENT with styles scoped via wrapper */}
        <div
          id="gjs-content-wrapper"
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.contents }}
        />

        {/* Inject GrapesJS JS at bottom if present */}
        {gjsJS && (
          <script
            dangerouslySetInnerHTML={{ __html: gjsJS }}
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params }: any) {
  try {
    const res = await getArticleBySlug(params.slug);

    return {
      props: {
        pageData: {
          title: res.data.name,
          album: articleToAlbum(res.data),
        },
        article: res.data,
      },
    };
  } catch (error) {
    console.error("NewsDetailPage error:", error);
    return { notFound: true };
  }
}

NewsDetailPage.Layout = LandingPageLayout;