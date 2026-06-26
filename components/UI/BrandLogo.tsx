import React, { useEffect, useState } from "react";
import { DEFAULT_LOGO_SRC } from "@/lib/mediaAssets";

type BrandLogoProps = {
  src?: string | null;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
};

export default function BrandLogo({
  src,
  alt,
  className,
  style,
  fallbackSrc = DEFAULT_LOGO_SRC,
}: BrandLogoProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
