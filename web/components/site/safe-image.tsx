"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

const FALLBACK_SRC = "/media/image-placeholder.svg";

/**
 * Renders an uploaded/DB-backed image, falling back to a generic "image
 * unavailable" graphic if the real one fails to load — a corrupted file,
 * an object deleted from storage out from under a still-referencing row,
 * or a transient network error. Upload-time validation (see
 * lib/media-validation.ts) keeps bad files from being stored in the first
 * place; this is the second line of defense for everything else.
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  style,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const failed = erroredSrc === src;

  return (
    <Image
      className={className}
      style={style}
      src={failed ? FALLBACK_SRC : src}
      alt={failed ? "" : alt}
      width={width}
      height={height}
      unoptimized
      onError={() => setErroredSrc(src)}
    />
  );
}
