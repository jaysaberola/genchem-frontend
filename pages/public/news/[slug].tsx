import Head from "next/head";
import { useEffect } from "react";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import PrivateContentNotice from "@/components/Cms/PrivateContentNotice";
import { getArticleBySlug } from "@/services/articleService";
import { articleToAlbum } from "@/schemas/articleToAlbum";
import { getPrivateArticleFromError } from "@/lib/cmsPrivateContent";
import { CmsHtmlBlock } from "@/lib/publicClientComponents";

type Props = {
  pageData: any;
  article: any;
  isPrivate?: boolean;
  privateTitle?: string;
};

export default function NewsDetailPage({ article, isPrivate, privateTitle }: Props) {
  if (isPrivate) {
    return <PrivateContentNotice title={privateTitle} kind="article" />;
  }
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

  useEffect(() => {
    if (!gjsJS) return;
    const script = document.createElement("script");
    script.textContent = gjsJS;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [gjsJS]);

  return (
    <>
      <Head>
        <title>{article.meta_title || article.name}</title>
        <meta
          name="description"
          content={article.meta_description || article.teaser}
        />
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
        <CmsHtmlBlock
          html={article.contents}
          css={finalCSS}
          styleId="article-gjs-styles"
          className="article-content"
        />
      </div>
    </>
  );
}

export async function getServerSideProps({ params, query }: any) {
  const previewToken =
    typeof query?.preview_token === "string"
      ? query.preview_token
      : undefined;
  try {
    const res = await getArticleBySlug(
      params.slug,
      previewToken ? { preview_token: previewToken } : undefined,
    );

    return {
      props: {
        pageData: {
          title: res.data.name,
          album: articleToAlbum(res.data),
        },
        article: res.data,
        isPrivate: false,
      },
    };
  } catch (error) {
    const privateInfo = getPrivateArticleFromError(error);
    if (privateInfo) {
      return {
        props: {
          pageData: { title: privateInfo.title ?? params.slug },
          article: null,
          isPrivate: true,
          privateTitle: privateInfo.title ?? params.slug,
        },
      };
    }
    console.error("NewsDetailPage error:", error);
    return { notFound: true };
  }
}

NewsDetailPage.Layout = LandingPageLayout;