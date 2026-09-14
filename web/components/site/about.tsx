import type { getAbout } from "@/lib/content";

export function About({ about }: { about: Awaited<ReturnType<typeof getAbout>> }) {
  if (!about) return null;
  return (
    <section className="section" id="about">
      <div className="section-head">
        <div className="section-head__title">
          <span className="section-head__num">01</span>
          <span className="section-head__label">ABOUT ME</span>
        </div>
      </div>
      <div className="about">
        <div>
          <div className="about__facts">
            <div>
              Born
              <span className="value">{about.bornOn}</span>
            </div>
            <div>
              Based in
              <span className="value">{about.basedIn}</span>
            </div>
            <div>
              Role
              <span className="value">{about.role}</span>
            </div>
            <div>
              Training
              <span className="value">{about.training}</span>
            </div>
          </div>
        </div>
        <div className="about__copy">
          <p>{about.paragraph1}</p>
          {about.paragraph2 && <p>{about.paragraph2}</p>}
          <div className="about__quote">
            <span className="about__quote-label">{about.quoteLabel}</span>
            <span className="about__quote-text">“{about.quote}”</span>
          </div>
        </div>
      </div>
    </section>
  );
}
