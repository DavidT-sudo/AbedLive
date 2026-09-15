"use client";

import Image from "next/image";
import type {getReleases} from "@/lib/content";
import {usePlayer} from "@/components/site/player-context";

type Release = Awaited<ReturnType<typeof getReleases>>[number];

export function OpenSkyDiscography({
  releases,
}: {
  releases: Awaited<ReturnType<typeof getReleases>>;
}) {
  const {active: playing, play} = usePlayer();
  const active: Release | undefined = releases.find(
    (r) => r.spotifyUrl === playing?.url
  );

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
              onClick={
                playable
                  ? () =>
                      play({
                        title: r.title,
                        subtitle: `${r.year} · ${r.kind}`,
                        url: r.spotifyUrl!,
                      })
                  : undefined
              }
              onKeyDown={
                playable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        play({
                          title: r.title,
                          subtitle: `${r.year} · ${r.kind}`,
                          url: r.spotifyUrl!,
                        });
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
    </section>
  );
}
