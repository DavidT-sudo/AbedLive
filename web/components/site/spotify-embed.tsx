import { spotifyEmbedSrc, spotifyEmbedHeight } from "@/lib/spotify";

export function SpotifyEmbed({ url }: { url: string | null | undefined }) {
  const src = spotifyEmbedSrc(url);
  if (!src) return null;
  const height = spotifyEmbedHeight(url);

  return (
    <iframe
      className="spotify-embed"
      src={src}
      width="100%"
      height={height}
      style={{ borderRadius: 8, border: 0, display: "block" }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify player"
    />
  );
}
