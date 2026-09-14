import type { getTopTracks } from "@/lib/content";
import { TopTracks } from "@/components/site/top-tracks";

export function OpenSkyListen({
  tracks,
}: {
  tracks: Awaited<ReturnType<typeof getTopTracks>>;
}) {
  if (!tracks.some((t) => t.spotifyUrl)) return null;
  return (
    <section className="os-listen">
      <div className="os-listen__head">
        <div>
          <div className="os-eyebrow">Listen</div>
          <div className="os-listen__title">Popular Tracks</div>
        </div>
      </div>
      <TopTracks tracks={tracks} />
    </section>
  );
}
