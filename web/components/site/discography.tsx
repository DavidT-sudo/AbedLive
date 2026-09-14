import type { getReleases } from "@/lib/content";

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
          <div className="release-row" key={r.id}>
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
        ))}
      </div>
    </section>
  );
}
