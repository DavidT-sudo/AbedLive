import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  siteSettings,
  heroContent,
  awardStats,
  aboutContent,
  releases,
  liveHighlights,
  openSkyIntro,
  openSkyEditions,
  topTracks,
  beyondMusicItems,
  contactInfo,
  socialLinks,
  mediaSlots,
  media,
} from "@/db/schema";

export async function getSiteSettings() {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, "default"));
  return row ?? null;
}

export async function getHero() {
  const [row] = await db
    .select({
      id: heroContent.id,
      kicker: heroContent.kicker,
      titleLine1: heroContent.titleLine1,
      titleLine2: heroContent.titleLine2,
      locationLine: heroContent.locationLine,
      genreLine: heroContent.genreLine,
      releaseNote: heroContent.releaseNote,
      releaseCtaLabel: heroContent.releaseCtaLabel,
      releaseCtaHref: heroContent.releaseCtaHref,
      imageUrl: media.url,
      imageAlt: media.alt,
    })
    .from(heroContent)
    .leftJoin(media, eq(heroContent.imageId, media.id))
    .where(eq(heroContent.id, "default"));
  return row ?? null;
}

export async function getAwardStats() {
  return db.select().from(awardStats).orderBy(asc(awardStats.sortOrder));
}

export async function getAbout() {
  const [row] = await db
    .select()
    .from(aboutContent)
    .where(eq(aboutContent.id, "default"));
  return row ?? null;
}

export async function getReleases() {
  return db
    .select({
      id: releases.id,
      title: releases.title,
      subtitle: releases.subtitle,
      kind: releases.kind,
      note: releases.note,
      year: releases.year,
      isLatest: releases.isLatest,
      coverUrl: media.url,
      coverAlt: media.alt,
      spotifyUrl: releases.spotifyUrl,
    })
    .from(releases)
    .leftJoin(media, eq(releases.coverImageId, media.id))
    .orderBy(asc(releases.sortOrder));
}

export async function getLiveHighlights() {
  return db
    .select()
    .from(liveHighlights)
    .orderBy(asc(liveHighlights.sortOrder));
}

export async function getOpenSkyIntro() {
  const [row] = await db
    .select()
    .from(openSkyIntro)
    .where(eq(openSkyIntro.id, "default"));
  return row ?? null;
}

export async function getOpenSkyEditions() {
  return db
    .select({
      id: openSkyEditions.id,
      title: openSkyEditions.title,
      posterUrl: media.url,
      posterAlt: media.alt,
    })
    .from(openSkyEditions)
    .leftJoin(media, eq(openSkyEditions.posterImageId, media.id))
    .orderBy(asc(openSkyEditions.sortOrder));
}

export async function getTopTracks() {
  return db.select().from(topTracks).orderBy(asc(topTracks.sortOrder));
}

export async function getBeyondMusicItems() {
  return db
    .select()
    .from(beyondMusicItems)
    .orderBy(asc(beyondMusicItems.sortOrder));
}

export async function getContactInfo() {
  const [row] = await db
    .select()
    .from(contactInfo)
    .where(eq(contactInfo.id, "default"));
  return row ?? null;
}

export async function getSocialLinks() {
  return db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
}

export async function getMediaSlot(slug: string) {
  const [row] = await db
    .select({ slug: mediaSlots.slug, url: media.url, alt: media.alt })
    .from(mediaSlots)
    .leftJoin(media, eq(mediaSlots.mediaId, media.id))
    .where(eq(mediaSlots.slug, slug));
  return row ?? null;
}

/** Fetches everything the public homepage needs in one shot. */
export async function getHomepageData() {
  const [
    settings,
    hero,
    stats,
    about,
    discography,
    live,
    openSky,
    openSkyPosters,
    topTracksList,
    beyondMusic,
    contact,
    socials,
    purposeBreak,
  ] = await Promise.all([
    getSiteSettings(),
    getHero(),
    getAwardStats(),
    getAbout(),
    getReleases(),
    getLiveHighlights(),
    getOpenSkyIntro(),
    getOpenSkyEditions(),
    getTopTracks(),
    getBeyondMusicItems(),
    getContactInfo(),
    getSocialLinks(),
    getMediaSlot("purpose-break"),
  ]);

  return {
    settings,
    hero,
    stats,
    about,
    discography,
    live,
    openSky,
    openSkyPosters,
    topTracks: topTracksList,
    beyondMusic,
    contact,
    socials,
    purposeBreak,
  };
}
