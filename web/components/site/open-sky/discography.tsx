"use client";

import Image from "next/image";
import {useState} from "react";
import type {getReleases} from "@/lib/content";
import {SpotifyDrawer} from "@/components/site/spotify-drawer";

type Release = Awaited<ReturnType<typeof getReleases>>[number];

export function OpenSkyDiscography({
  releases,
}: {
  releases: Awaited<ReturnType<typeof getReleases>>;
}) {
  const [active, setActive] = useState<Release | null>(null);

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
        {releases.map((r) => {
          const playable = Boolean(r.spotifyUrl);
          const isActive = playable && active?.id === r.id;
          return (
            <div
              className={`os-record${isActive ? " os-record--active" : ""}`}
              key={r.id}
              data-latest={r.isLatest || undefined}
              role={playable ? "button" : undefined}
              tabIndex={playable ? 0 : undefined}
              aria-pressed={playable ? isActive : undefined}
              onClick={playable ? () => setActive(r) : undefined}
              onKeyDown={
                playable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(r);
                      }
                    }
                  : undefined
              }
            >
              <div
                className={`os-record__art${playable ? " os-record__art--playable" : ""}`}
              >
                {r.coverUrl && (
                  <Image
                    src={r.coverUrl}
                    alt={r.coverAlt || r.title}
                    width={240}
                    height={240}
                    unoptimized
                  />
                )}
                {r.isLatest && <span className="os-record__badge">Latest</span>}
                {playable && (
                  <span className="os-record__play" aria-hidden="true">
                    {isActive ? "♪" : "▶"}
                  </span>
                )}
              </div>
              <div className="os-record__title">{r.title}</div>
              <div className="os-record__meta">
                {r.year} · {r.kind}
              </div>
            </div>
          );
        })}
      </div>

      {active && active.spotifyUrl && (
        <SpotifyDrawer
          title={active.title}
          subtitle={`${active.year} · ${active.kind}`}
          url={active.spotifyUrl}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
