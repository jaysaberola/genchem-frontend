import { useEffect, useState } from "react";
import { PublicAlbum } from "@/services/publicPageService";
import { resolveManagedAssetUrl } from "@/lib/mediaAssets";

interface PageBannerProps {
  title?: string;
  subtitle?: string;
  album?: PublicAlbum | null;
  imageOnly?: boolean;
}

export default function PageBanner({
  album,
  imageOnly = true,
}: PageBannerProps) {
  const banners = album?.banners || [];
  const [current, setCurrent] = useState(0);

  const interval =
    typeof album?.transition === "number"
      ? album.transition * 1000
      : 5000;

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, interval]);

  if (banners.length > 0) {
    return (
      <section className="genchem-page-banner" aria-label="Page banner">
        {banners.map((banner, index) => {
          const imageUrl =
            resolveManagedAssetUrl(banner.image_url) || banner.image_url;

          return (
            <div
              key={banner.id ?? index}
              className="genchem-page-banner__slide"
              style={{
                backgroundImage: `url(${imageUrl})`,
                opacity: index === current ? 1 : 0,
                zIndex: index === current ? 1 : 0,
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
