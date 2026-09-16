"use client";

import {useEffect, useRef, useState} from "react";
import {SafeImage} from "@/components/site/safe-image";

export type PosterCarouselItem = {
  id: string;
  title: string;
  posterUrl?: string | null;
  posterAlt?: string | null;
  /** Not populated yet — editions don't carry a description field today.
   * The caption already renders below the image so this slots in later
   * with no further layout change. */
  description?: string | null;
};

export function PosterCarousel({items}: {items: PosterCarouselItem[]}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Which card is nearest the track's own center — used on mobile to blur
  // every other card and keep focus on the one the user is actually on.
  // Desktop shows several cards at once with no single "focused" one, so
  // this is ignored there (see the CSS override at min-width: 860px).
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // `scroll-snap-align: center` (see globals.css) makes some browsers
    // settle on a non-zero initial scroll position on load — as if the
    // very first render's layout pass computed a snap point before the
    // track's own width was final and "corrected" to it. Pin it to the
    // real start explicitly rather than trusting the native default.
    track.scrollTo({left: 0});

    function updateActive() {
      const trackEl = trackRef.current;
      if (!trackEl) return;
      const trackRect = trackEl.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      const itemEls = trackEl.querySelectorAll<HTMLElement>("[data-carousel-item]");
      let closest = 0;
      let closestDist = Infinity;
      itemEls.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    }

    updateActive();
    // Deliberately unthrottled (rAF-throttling scroll handlers is the
    // usual move, but this only measures ~5 small DOM rects per event —
    // cheap enough to skip the extra moving part).
    track.addEventListener("scroll", updateActive, {passive: true});
    window.addEventListener("resize", updateActive);
    return () => {
      track.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items.length]);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector<HTMLElement>("[data-carousel-item]");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = item
      ? item.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8;
    // No explicit `behavior` — CSS `scroll-behavior: smooth` on the track
    // drives the animation. The JS `behavior: "smooth"` option depends on
    // the browser actually running a rAF-driven scroll animation, which
    // some embedded/automated contexts silently never progress; native
    // CSS smooth scrolling is the more robustly-supported path.
    track.scrollBy({left: direction * step});
  }

  if (!items.length) return null;

  return (
    <div className="poster-carousel">
      <div className="poster-carousel__track" ref={trackRef} role="list">
        {items.map((item, i) => (
          <figure
            className={`poster-carousel__item${
              i === activeIndex ? " poster-carousel__item--active" : ""
            }`}
            data-carousel-item
            role="listitem"
            key={item.id}
          >
            {item.posterUrl && (
              <div className="poster-carousel__image-wrap">
                <SafeImage
                  className="poster-carousel__image"
                  src={item.posterUrl}
                  alt={item.posterAlt || `Open Sky Gathering ${item.title}`}
                  width={320}
                  height={420}
                />
                <div className="poster-carousel__glass" aria-hidden="true" />
              </div>
            )}
            <figcaption className="poster-carousel__caption">
              {item.title}
              {item.description && (
                <span className="poster-carousel__desc">
                  {item.description}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="poster-carousel__controls">
          <button
            type="button"
            className="poster-carousel__btn"
            onClick={() => scroll(-1)}
            aria-label="Previous edition"
          >
            ‹
          </button>
          <button
            type="button"
            className="poster-carousel__btn"
            onClick={() => scroll(1)}
            aria-label="Next edition"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
