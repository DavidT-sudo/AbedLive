import Image from "next/image";
import type {getOpenSkyIntro, getOpenSkyEditions} from "@/lib/content";
import {PosterCarousel} from "@/components/site/poster-carousel";

export function OpenSkyLive({
  openSky,
  posters,
}: {
  openSky: Awaited<ReturnType<typeof getOpenSkyIntro>>;
  posters: Awaited<ReturnType<typeof getOpenSkyEditions>>;
}) {
  if (!openSky) return null;
  return (
    <section className="os-live" id="live">
      <Image
        className="os-live__bg"
        src="/media/live-purple.png"
        alt=""
        width={1600}
        height={900}
      />
      <div className="os-live__scrim" />
      <div className="os-live__grid">
        <div>
          <div className="os-eyebrow">{openSky.eyebrow}</div>
          <div className="os-live__title">
            {openSky.title.split(" ").slice(0, -1).join(" ")}
            <br />
            {openSky.title.split(" ").at(-1)}
          </div>
          <p className="os-live__body">{openSky.body}</p>
          {/* openSky.ctaHref has no real destination yet ("#") — hidden
              until there's somewhere for it to actually go. */}
          {/* <div className="os-live__ctas">
            <a className="os-btn os-btn--solid" href={openSky.ctaHref}>
              Next edition
            </a>
            <a className="os-btn os-btn--outline" href={openSky.ctaHref}>
              Past editions
            </a>
          </div> */}
        </div>
        <div className="os-live__posters">
          <PosterCarousel items={posters} />
        </div>
      </div>
    </section>
  );
}
