import type { getTopTracks } from "@/lib/content";
import { TopTracks } from "@/components/site/top-tracks";

export function Listen({
  tracks,
}: {
  tracks: Awaited<ReturnType<typeof getTopTracks>>;
}) {
  if (!tracks.some((t) => t.spotifyUrl)) return null;
  return (
    <section className="section" id="tracks">
      <TopTracks
        tracks={tracks}
        eyebrow={
          <div className="section-head">
            <div className="section-head__title">
              <span className="section-head__num">03</span>
              <span className="section-head__label">LISTEN</span>
            </div>
            <span className="section-head__note">Popular tracks</span>
          </div>
        }
      />
    </section>
  );
}
