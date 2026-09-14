const EMBEDDABLE_TYPES = new Set([
  "track",
  "album",
  "artist",
  "playlist",
  "episode",
  "show",
]);

/**
 * Parses a pasted open.spotify.com link into {type, id}, or null if it
 * isn't a recognizable Spotify content URL. This is the only thing an admin
 * form should trust before building an embed — never render a pasted value
 * as raw HTML/iframe src directly.
 */
export function parseSpotifyUrl(
  input: string
): { type: string; id: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!/(^|\.)spotify\.com$/.test(url.hostname)) return null;

  // Path looks like /embed/track/ID, /track/ID, or /intl-xx/track/ID
  const parts = url.pathname.split("/").filter(Boolean);
  const embedIndex = parts.indexOf("embed");
  const relevant = embedIndex !== -1 ? parts.slice(embedIndex + 1) : parts;
  const typeIndex = relevant.findIndex((p) => EMBEDDABLE_TYPES.has(p));
  if (typeIndex === -1 || !relevant[typeIndex + 1]) return null;

  const type = relevant[typeIndex];
  const id = relevant[typeIndex + 1].split("?")[0];
  if (!/^[A-Za-z0-9]+$/.test(id)) return null;

  return { type, id };
}

/** Builds the official Spotify embed iframe src for a parsed link, or null. */
export function spotifyEmbedSrc(input: string | null | undefined): string | null {
  if (!input) return null;
  const parsed = parseSpotifyUrl(input);
  if (!parsed) return null;
  return `https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator`;
}

/** Compact player height by content type, matching Spotify's own embed sizing. */
export function spotifyEmbedHeight(input: string | null | undefined): number {
  const parsed = input ? parseSpotifyUrl(input) : null;
  if (parsed?.type === "track" || parsed?.type === "episode") return 152;
  return 352;
}
