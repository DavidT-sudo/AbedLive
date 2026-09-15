import Image from "next/image";
import type {getHero, getReleases} from "@/lib/content";
import {ListenButton} from "@/components/site/listen-button";

export function Hero({
  hero,
  featuredRelease,
}: {
  hero: Awaited<ReturnType<typeof getHero>>;
  featuredRelease?: Awaited<ReturnType<typeof getReleases>>[number];
}) {
  if (!hero) return null;
  return (
    <section className="hero" id="top">
      {hero.imageUrl && (
        <Image
          className="hero__image"
          src={hero.imageUrl}
          alt={hero.imageAlt || ""}
          width={1600}
          height={900}
        />
      )}
      <div className="hero__scrim" />
      <div className="hero__title">
        <div className="hero__title-line">{hero.titleLine1}</div>
        <div className="hero__title-line">{hero.titleLine2}</div>
        <div className="hero__kicker">{hero.kicker}</div>
      </div>
      <div className="hero__meta">
        <div className="hero__meta-block">
          <span>{hero.locationLine}</span>
          <span>{hero.genreLine}</span>
        </div>
        <div className="hero__meta-block hero__meta-block--right">
          <span>{hero.releaseNote}</span>
          {featuredRelease?.spotifyUrl ? (
            <ListenButton
              className="hero__cta"
              label={hero.releaseCtaLabel}
              title={featuredRelease.title}
              subtitle={`${featuredRelease.kind} · ${featuredRelease.year}`}
              url={featuredRelease.spotifyUrl}
            />
          ) : (
            <a className="hero__cta" href={hero.releaseCtaHref}>
              {hero.releaseCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
