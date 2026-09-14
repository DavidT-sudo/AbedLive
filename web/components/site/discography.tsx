"use client";

import { useState } from "react";
import type { getReleases } from "@/lib/content";
import { SpotifyDrawer } from "@/components/site/spotify-drawer";

type Release = Awaited<ReturnType<typeof getReleases>>[number];

export function Discography({
  releases,
}: {
  releases: Awaited<ReturnType<typeof getReleases>>;
}) {
  const [active, setActive] = useState<Release | null>(null);

  if (!releases.length) return null;

  return (
    <section className="section section--alt" id="discography">
      <div className="section-head">
        <div className="section-head__title">
          <span className="section-head__num">02</span>
          <span className="section-head__label">DISCOGRAPHY</span>
        </div>
        <span className="section-head__note">
          {releases.length} release{releases.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="discography">
        {releases.map((r) => {
          const playable = Boolean(r.spotifyUrl);
          const isActive = playable && active?.id === r.id;
          return (
            <div className="release-item" key={r.id}>
              <div
                className={`release-row${playable ? " release-row--playable" : ""}${
                  isActive ? " release-row--active" : ""
                }`}
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
                {r.coverUrl && (
                  <div className="release-row__cover-wrap">
                    <img
                      className="release-row__cover"
                      src={r.coverUrl}
                      alt={r.coverAlt || r.title}
                    />
                    {playable && (
                      <span className="release-row__play" aria-hidden="true">
                        {isActive ? "♪" : "▶"}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="release-row__title">
                    {r.title} {r.subtitle && <span>{r.subtitle}</span>}
                  </div>
                  <div className="release-row__meta-mobile">
                    {r.kind} · {r.year}
                  </div>
                </div>
                <div className="release-row__kind">{r.kind}</div>
                <div className="release-row__note">{r.note}</div>
                <div className="release-row__year">{r.year}</div>
              </div>
            </div>
          );
        })}
      </div>

      {active && active.spotifyUrl && (
        <SpotifyDrawer
          title={active.title}
          subtitle={`${active.kind} · ${active.year}`}
          url={active.spotifyUrl}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
