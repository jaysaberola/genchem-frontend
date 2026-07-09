import { PublicAlbum } from "@/services/publicPageService";
import MainBanner from "./MainBanner";
import PageBanner from "./PageBanner";

interface BannerProps {
  title?: string;
  subtitle?: string;
  album?: PublicAlbum | null;
  imageUrl?: string | null;
}

export default function Banner({
  title,
  subtitle,
  album,
  imageUrl,
}: BannerProps) {
  if (title === "News") {
    return null;
  }

  const hasAlbumBanners = Boolean(album?.banners?.length);
  const hasImageBanner = Boolean(imageUrl?.trim());

  if (!hasAlbumBanners && !hasImageBanner) {
    return null;
  }

  if (hasAlbumBanners && album?.type === "main_banner") {
    return <MainBanner album={album} />;
  }

  return (
    <PageBanner
      title={title}
      subtitle={subtitle}
      album={album}
      imageUrl={imageUrl}
      imageOnly
    />
  );
}
