import type { getReleases } from "@/lib/content";

export function OpenSkyDiscography({
  releases,
}: {
  releases: Awaited<ReturnType<typeof getReleases>>;
}) {
  if (!releases.length) return null;
  return (
    <section className="os-discography" id="discography">
      <div className="os-discography__head">
        <div>
          <div className="os-eyebrow">Discography</div>
          <div className="os-discography__title">The Records</div>
        </div>
        <a className="os-link" href="#discography">
          All releases ↗
        </a>
      </div>
      <div className="os-discography__grid">
        {releases.map((r) => (
          <div className="os-record" key={r.id} data-latest={r.isLatest || undefined}>
            <div className="os-record__art">
              {r.coverUrl && <img src={r.coverUrl} alt={r.coverAlt || r.title} />}
              {r.isLatest && <span className="os-record__badge">Latest</span>}
            </div>
            <div className="os-record__title">{r.title}</div>
            <div className="os-record__meta">
              {r.year} · {r.kind}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
