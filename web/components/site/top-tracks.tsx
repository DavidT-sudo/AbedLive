import type { getTopTracks } from "@/lib/content";
import { SpotifyEmbed } from "@/components/site/spotify-embed";

export function TopTracks({
  tracks,
  eyebrow,
}: {
  tracks: Awaited<ReturnType<typeof getTopTracks>>;
  eyebrow?: React.ReactNode;
}) {
  const playable = tracks.filter((t) => t.spotifyUrl);
  if (!playable.length) return null;
  return (
    <div className="top-tracks">
      {eyebrow}
      <div className="top-tracks__grid">
        {playable.map((t) => (
          <div className="top-tracks__card" key={t.id}>
            <SpotifyEmbed url={t.spotifyUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}
