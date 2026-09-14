import type { getReleases } from "@/lib/content";
import { SpotifyEmbed } from "@/components/site/spotify-embed";

export function Discography({
  releases,
}: {
  releases: Awaited<ReturnType<typeof getReleases>>;
}) {
  if (!releases.length) return null;
  return (
    <section className="section section--alt" id="discography">
      <div className="section-head">
        <div className="section-head__title">
          <span className="section-head__num">02</span>
          <span className="section-head__label">DISCOGRAPHY</span>
        </div>
        <span className="section-head__note">
          {releases.length} release{releases.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="discography">
        {releases.map((r) => (
          <div className="release-item" key={r.id}>
            <div className="release-row">
              {r.coverUrl && (
                <img
                  className="release-row__cover"
                  src={r.coverUrl}
                  alt={r.coverAlt || r.title}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="release-row__title">
                  {r.title} {r.subtitle && <span>{r.subtitle}</span>}
                </div>
                <div className="release-row__meta-mobile">
                  {r.kind} · {r.year}
                </div>
              </div>
              <div className="release-row__kind">{r.kind}</div>
              <div className="release-row__note">{r.note}</div>
              <div className="release-row__year">{r.year}</div>
            </div>
            {r.spotifyUrl && (
              <div className="release-embed">
                <SpotifyEmbed url={r.spotifyUrl} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
