import type {
  getLiveHighlights,
  getOpenSkyIntro,
  getOpenSkyEditions,
} from "@/lib/content";

export function LiveSection({
  highlights,
  openSky,
  posters,
}: {
  highlights: Awaited<ReturnType<typeof getLiveHighlights>>;
  openSky: Awaited<ReturnType<typeof getOpenSkyIntro>>;
  posters: Awaited<ReturnType<typeof getOpenSkyEditions>>;
}) {
  return (
    <section className="section" id="live">
      <div className="section-head">
        <div className="section-head__title">
          <span className="section-head__num">04</span>
          <span className="section-head__label">LIVE</span>
        </div>
        <span className="section-head__note">Stage &amp; festival</span>
      </div>

      {highlights.length > 0 && (
        <div className="live-highlights">
          {highlights.map((h) => (
            <div className="live-highlights__item" key={h.id}>
              <div className="live-highlights__title">{h.title}</div>
              <div className="live-highlights__sub">{h.subtitle}</div>
            </div>
          ))}
        </div>
      )}

      {openSky && (
        <div className="open-sky">
          <div>
            <div className="open-sky__eyebrow">{openSky.eyebrow}</div>
            <div className="open-sky__title">{openSky.title}</div>
            <p className="open-sky__body">{openSky.body}</p>
            <a className="open-sky__cta" href={openSky.ctaHref}>
              {openSky.ctaLabel}
            </a>
          </div>
          {posters.length > 0 && (
            <div className="open-sky__posters">
              {posters.map((p) => (
                <div className="open-sky__poster-wrap" key={p.id}>
                  <img
                    className="open-sky__poster"
                    src={p.posterUrl ?? ""}
                    alt={`Open Sky Gathering ${p.title}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
