import { PublicAlbum } from "@/services/publicPageService";
import { resolveManagedAssetUrl, toCssBackgroundImage } from "@/lib/mediaAssets";
import { useBannerCarousel } from "@/lib/useBannerCarousel";

interface PageBannerProps {
  title?: string;
  subtitle?: string;
  album?: PublicAlbum | null;
  imageUrl?: string | null;
  imageOnly?: boolean;
}

export default function PageBanner({
  album,
  imageUrl,
  imageOnly = true,
}: PageBannerProps) {
  const banners = album?.banners || [];
  const staticImage = imageUrl?.trim();

  if (staticImage && banners.length === 0) {
    const resolved =
      resolveManagedAssetUrl(staticImage) || staticImage;
    const backgroundImage = toCssBackgroundImage(resolved);

    return (
      <section className="genchem-page-banner" aria-label="Page banner">
        <div
          className="genchem-page-banner__slide"
          style={{
            backgroundImage,
            opacity: 1,
            zIndex: 1,
          }}
        />
      </section>
    );
  }

  const { isSlideVisible, getSlideAnimationClass, getSlideZIndex } =
    useBannerCarousel(
      banners.length,
      album?.transition,
      album?.transition_in,
      album?.transition_out,
    );

  if (banners.length > 0) {
    return (
      <section className="genchem-page-banner" aria-label="Page banner">
        {banners.map((banner, index) => {
          const imageUrl =
            resolveManagedAssetUrl(banner.image_url) || banner.image_url;
          const backgroundImage = toCssBackgroundImage(imageUrl);

          return (
            <div
              key={banner.id ?? index}
              className={`genchem-page-banner__slide ${getSlideAnimationClass(index)}`}
              style={{
                backgroundImage,
                opacity: isSlideVisible(index) ? 1 : 0,
                zIndex: getSlideZIndex(index),
              }}
            />
          );
        })}
      </section>
    );
  }

  return (
    <section className="genchem-page-banner genchem-page-banner--fallback" />
  );
}
