"use client";

import {createContext, useContext, useMemo, useState, type ReactNode} from "react";
import {SpotifyDrawer} from "@/components/site/spotify-drawer";

type Track = {title: string; subtitle?: string; url: string};

const PlayerContext = createContext<{
  active: Track | null;
  play: (track: Track) => void;
  close: () => void;
} | null>(null);

/**
 * Shared "now playing" state so the Spotify drawer can be opened from
 * anywhere on the page (hero CTA, discography rows, ...) instead of each
 * section owning its own isolated drawer instance.
 */
export function PlayerProvider({children}: {children: ReactNode}) {
  const [active, setActive] = useState<Track | null>(null);

  const value = useMemo(
    () => ({
      active,
      play: (track: Track) => setActive(track),
      close: () => setActive(null),
    }),
    [active]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {active && (
        <SpotifyDrawer
          title={active.title}
          subtitle={active.subtitle}
          url={active.url}
          onClose={value.close}
        />
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
