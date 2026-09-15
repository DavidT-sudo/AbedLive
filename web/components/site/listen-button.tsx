"use client";

import {usePlayer} from "@/components/site/player-context";

/** Opens the shared Spotify drawer for a track, used by both themes' hero CTA. */
export function ListenButton({
  className,
  label,
  title,
  subtitle,
  url,
}: {
  className?: string;
  label: string;
  title: string;
  subtitle?: string;
  url: string;
}) {
  const {play} = usePlayer();
  return (
    <button
      type="button"
      className={className}
      onClick={() => play({title, subtitle, url})}
    >
      {label}
    </button>
  );
}
