"use client";

import { useEffect, useRef, useState } from "react";
import { SpotifyEmbed } from "@/components/site/spotify-embed";
import { spotifyEmbedHeight } from "@/lib/spotify";

export function SpotifyDrawer({
  title,
  subtitle,
  url,
  onClose,
}: {
  title: string;
  subtitle?: string;
  url: string;
  onClose: () => void;
}) {
  const fullHeight = spotifyEmbedHeight(url);
  const [bodyHeight, setBodyHeight] = useState(fullHeight);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startY: number; startHeight: number } | null>(null);

  // A newly selected track/album always opens expanded.
  useEffect(() => {
    setBodyHeight(spotifyEmbedHeight(url));
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function clamp(h: number) {
    return Math.min(fullHeight, Math.max(0, h));
  }

  function settle(h: number) {
    if (h < fullHeight * 0.25) return 0;
    if (h > fullHeight * 0.75) return fullHeight;
    return h;
  }

  function toggleCollapsed() {
    setDragging(false);
    setBodyHeight((h) => (h > 4 ? 0 : fullHeight));
  }

  return (
    <div
      className="spotify-drawer"
      role="dialog"
      aria-label={`Now playing: ${title}`}
    >
      <div
        className="spotify-drawer__handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize player. Drag, use arrow keys, or double-click to minimize or expand."
        title="Drag to resize, double-click to minimize"
        aria-valuenow={Math.round((bodyHeight / fullHeight) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { startY: e.clientY, startHeight: bodyHeight };
          setDragging(true);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const delta = drag.current.startY - e.clientY;
          setBodyHeight(clamp(drag.current.startHeight + delta));
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          drag.current = null;
          setDragging(false);
          setBodyHeight((h) => settle(h));
        }}
        onPointerCancel={() => {
          drag.current = null;
          setDragging(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") setBodyHeight((h) => clamp(h + 24));
          if (e.key === "ArrowDown") setBodyHeight((h) => clamp(h - 24));
          if (e.key === "Home") setBodyHeight(0);
          if (e.key === "End") setBodyHeight(fullHeight);
        }}
        onDoubleClick={toggleCollapsed}
      >
        <span className="spotify-drawer__grip" aria-hidden="true" />
      </div>
      <div className="spotify-drawer__head">
        <div className="spotify-drawer__info">
          <div className="spotify-drawer__title">{title}</div>
          {subtitle && (
            <div className="spotify-drawer__subtitle">{subtitle}</div>
          )}
        </div>
        <button
          type="button"
          className="spotify-drawer__close"
          onClick={onClose}
          aria-label="Close player"
        >
          ✕
        </button>
      </div>
      <div
        className="spotify-drawer__body"
        style={{
          height: bodyHeight,
          transition: dragging ? "none" : "height 0.2s ease",
        }}
      >
        <SpotifyEmbed url={url} />
      </div>
    </div>
  );
}
