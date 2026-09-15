import type {ReactNode} from "react";

// Full-color circular badge glyphs matching Abed's own brand material
// (see the icon row on his promotional banners) — real brand colors, not
// monochrome outlines, so each platform reads instantly at a glance.
const ICONS: Record<string, ReactNode> = {
  facebook: (
    <>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M14.5 21v-7.5h2.15l.35-2.58h-2.5v-1.6c0-.75.2-1.26 1.28-1.26h1.34V5.78c-.23-.03-1.03-.1-1.96-.1-1.94 0-3.27 1.19-3.27 3.37v1.87H9.3v2.58h2.09V21h3.11z"
        fill="#fff"
      />
    </>
  ),
  instagram: (
    <>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="10%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="100%" stopColor="#C837AB" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#ig-grad)" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="15.4" cy="8.6" r="0.85" fill="#fff" />
    </>
  ),
  tiktok: (
    <>
      <circle cx="12" cy="12" r="12" fill="#010101" />
      <path
        d="M14.65 6.5c.28 1.5 1.2 2.55 2.75 2.72v1.9c-.98-.03-1.9-.35-2.75-1v3.94c0 2.02-1.55 3.44-3.5 3.44a3.46 3.46 0 0 1-3.5-3.5c0-1.93 1.51-3.5 3.5-3.5.2 0 .39.02.58.05v1.93a1.6 1.6 0 0 0-.58-.11 1.63 1.63 0 1 0 0 3.26c.95 0 1.75-.7 1.75-1.72V6.5h1.75z"
        fill="#25F4EE"
      />
      <path
        d="M14.15 6.5c.28 1.5 1.2 2.55 2.75 2.72v1.9c-.98-.03-1.9-.35-2.75-1v3.94c0 2.02-1.55 3.44-3.5 3.44a3.46 3.46 0 0 1-3.5-3.5c0-1.93 1.51-3.5 3.5-3.5.2 0 .39.02.58.05v1.93a1.6 1.6 0 0 0-.58-.11 1.63 1.63 0 1 0 0 3.26c.95 0 1.75-.7 1.75-1.72V6.5h1.75z"
        fill="#FE2C55"
        opacity="0.75"
      />
      <path
        d="M14.4 6.5c.28 1.5 1.2 2.55 2.75 2.72v1.9c-.98-.03-1.9-.35-2.75-1v3.94c0 2.02-1.55 3.44-3.5 3.44a3.46 3.46 0 0 1-3.5-3.5c0-1.93 1.51-3.5 3.5-3.5.2 0 .39.02.58.05v1.93a1.6 1.6 0 0 0-.58-.11 1.63 1.63 0 1 0 0 3.26c.95 0 1.75-.7 1.75-1.72V6.5h1.75z"
        fill="#fff"
      />
    </>
  ),
  youtube: (
    <>
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      <path d="M10.2 8.7 15.8 12l-5.6 3.3V8.7z" fill="#fff" />
    </>
  ),
};

// Generic fallback for any platform without a dedicated glyph above (e.g.
// a future one added via /admin) — an external-link arrow, not blank.
const FALLBACK_ICON = (
  <>
    <circle cx="12" cy="12" r="12" fill="#3a3a3a" />
    <path
      d="M14 7h4v4M20 7l-8 8M18 15v3.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 18.5v-8A1.5 1.5 0 0 1 8.5 9H12"
      fill="none"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export function SocialIcon({platform, className}: {platform: string; className?: string}) {
  const icon = ICONS[platform.trim().toLowerCase()] ?? FALLBACK_ICON;
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      {icon}
    </svg>
  );
}
