import Image from "next/image";
import type {getHero, getReleases} from "@/lib/content";
import {ListenButton} from "@/components/site/listen-button";

export function OpenSkyHero({
  hero,
  featuredRelease,
  editionsCount,
}: {
  hero: Awaited<ReturnType<typeof getHero>>;
  featuredRelease?: Awaited<ReturnType<typeof getReleases>>[number];
  editionsCount?: number;
}) {
  if (!hero) return null;
  return (
    <section className="os-hero" id="top">
      <Image
        className="os-hero__image"
        src="/media/live-stage.png"
        alt=""
        width={1600}
        height={900}
      />
      <div className="os-hero__glow" />
      <div className="os-hero__scrim" />
      <div className="os-hero__tagline">Purpose in every note</div>
      <div className="os-hero__center">
        <div className="os-hero__kicker">{hero.kicker}</div>
        <Image
          className="os-hero__signature"
          src="/media/signature-white.png"
          alt="Abed"
          width={220}
          height={64}
        />
        <div className="os-hero__wordmark">{hero.titleLine2}</div>
        <p className="os-hero__body">
          {hero.genreLine} from {hero.locationLine.replace(" · ", ", ")} —
          rooted in faith, joy and the transformative power of salvation.
        </p>
        <div className="os-hero__ctas">
          {featuredRelease?.spotifyUrl ? (
            <ListenButton
              className="os-btn os-btn--solid"
              label={`Hear ${featuredRelease.title}`}
              title={featuredRelease.title}
              subtitle={`${featuredRelease.kind} · ${featuredRelease.year}`}
              url={featuredRelease.spotifyUrl}
            />
          ) : (
            <a className="os-btn os-btn--solid" href={hero.releaseCtaHref}>
              Hear Kgosi Jeso (Live)
            </a>
          )}
          <a className="os-btn os-btn--outline" href="#live">
            Watch a set
          </a>
        </div>
      </div>
      <div className="os-hero__meta">
        <span>Est. 2017 · Four releases</span>
        <span>Director · Abed Live</span>
        {editionsCount ? (
          <span>Open Sky Gathering · {editionsCount} editions</span>
        ) : (
          <span>Open Sky Gathering</span>
        )}
        <span className="os-hero__meta-scroll">Scroll ↓</span>
      </div>
    </section>
  );
}
