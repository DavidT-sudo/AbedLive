import type { ReactNode } from "react";

// Minimal outline glyphs for the platforms in Abed's bio (Facebook,
// Instagram, TikTok, YouTube). Single-color (`currentColor`) so each icon
// just inherits the link's text color/hover state from the footer's own
// CSS, rather than carrying brand colors of its own.
const ICONS: Record<string, ReactNode> = {
  facebook: (
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.5 1.5-1.5h1.6V4.35A20 20 0 0 0 14.5 4.2c-2.3 0-3.9 1.4-3.9 4V10.5H8v3h2.6V21h2.9z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path d="M14.5 3.5c.4 2 1.9 3.4 3.9 3.6v2.6a6.7 6.7 0 0 1-3.9-1.3v6.6a5 5 0 1 1-5-5c.28 0 .55.02.82.06v2.7a2.3 2.3 0 1 0 1.68 2.24V3.5h2.5z" />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.2v5.6l5-2.8z" fill="currentColor" />
    </>
  ),
};

// Generic fallback for any platform without a dedicated glyph above (e.g.
// a future one added via /admin) — an external-link arrow, not blank.
const FALLBACK_ICON = (
  <path d="M14 4h6v6M20 4 10 14M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
);

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const icon = ICONS[platform.trim().toLowerCase()] ?? FALLBACK_ICON;
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      {icon}
    </svg>
  );
}
