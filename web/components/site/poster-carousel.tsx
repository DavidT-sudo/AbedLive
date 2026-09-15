"use client";

import Image from "next/image";
import {useRef} from "react";

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

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector<HTMLElement>("[data-carousel-item]");
    const gap = 16;
    const step = item
      ? item.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8;
    track.scrollBy({left: direction * step, behavior: "smooth"});
  }

  if (!items.length) return null;

  return (
    <div className="poster-carousel">
      <div className="poster-carousel__track" ref={trackRef} role="list">
        {items.map((item) => (
          <figure
            className="poster-carousel__item"
            data-carousel-item
            role="listitem"
            key={item.id}
          >
            {item.posterUrl && (
              <Image
                className="poster-carousel__image"
                src={item.posterUrl}
                alt={item.posterAlt || `Open Sky Gathering ${item.title}`}
                width={320}
                height={420}
                unoptimized
              />
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
