import "dotenv/config";
import { db } from "./index";
import {
  media,
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
} from "./schema";

async function upsertMedia(fileName: string, alt: string) {
  const [row] = await db
    .insert(media)
    .values({ key: `media/${fileName}`, url: `/media/${fileName}`, alt })
    .returning();
  return row;
}

async function main() {
  // Guard against re-running against a database that's already seeded.
  // Most tables here use a random uuid() primary key with no other unique
  // constraint, so db:seed is NOT an upsert — re-running it would insert a
  // second, duplicate copy of every release/edition/award/etc. rather than
  // erroring or updating in place. Seed scripts are a one-time bootstrap
  // for an empty database, not an ongoing production tool; once real
  // content exists, further changes belong in /admin (or a migration for
  // schema changes), not here. See web/docs/adr for the deploy story this
  // fits into.
  const alreadySeeded = await db.select({ id: releases.id }).from(releases).limit(1);
  if (alreadySeeded.length > 0) {
    console.error(
      "Refusing to seed: the releases table already has rows, so this " +
        "database has already been seeded (or has real content). Re-running " +
        "db:seed here would duplicate rows, not update them. If you really " +
        "need to reset to seed data, wipe the relevant tables first."
    );
    process.exit(1);
  }

  console.log("Seeding local media rows...");
  const [
    portrait,
    coverKgosiJeso,
    coverAsYouWill,
    coverOTsholofelo,
    coverPhatsima,
    poster1,
    poster2,
    poster3,
    poster4,
    poster5,
    pianoHands,
  ] = await Promise.all([
    upsertMedia("portrait-white-jacket.png", "Abednico Wadingalo on stage"),
    upsertMedia("cover-kgosi-jeso.png", "With Kgosi Jeso (Live)"),
    upsertMedia("cover-as-you-will.png", "As You Will"),
    upsertMedia("cover-o-tsholofelo.png", "O Tsholofelo Live DVD"),
    upsertMedia("cover-phatsima.png", "Phatsima"),
    upsertMedia("poster-opensky-1.jpg", "Open Sky Gathering 1st Edition — 14 May 2022"),
    upsertMedia("poster-opensky-2.png", "Open Sky Gathering 2nd Edition"),
    upsertMedia("poster-opensky-3.png", "Open Sky Gathering 3rd Edition"),
    upsertMedia("poster-opensky-4.png", "Open Sky Gathering 4th Edition"),
    // 5th Edition hasn't happened yet (2026) — placeholder artwork until a
    // real flyer exists; replace via /admin/open-sky when it does.
    upsertMedia("poster-opensky-5.svg", "Open Sky Gathering 5th Edition — Amplified"),
    upsertMedia("piano-hands.png", ""),
  ]);

  console.log("Seeding site settings...");
  await db
    .insert(siteSettings)
    .values({ id: "default", theme: "press", siteTitle: "Abed Live" });

  console.log("Seeding hero...");
  await db.insert(heroContent).values({
    id: "default",
    kicker: "• MUSICIAN •",
    titleLine1: "ABED",
    titleLine2: "LIVE",
    locationLine: "Molepolole · Botswana",
    genreLine: "Contemporary Gospel · Afro-Jazz · Praise & Worship",
    releaseNote: "With Kgosi Jeso (Live) — out now",
    releaseCtaLabel: "Listen ↗",
    releaseCtaHref: "#discography",
    imageId: portrait.id,
  });

  console.log("Seeding award stats...");
  await db.insert(awardStats).values([
    { label: "3× Botswana Gospel Awards nominee", sortOrder: 0 },
    { label: "Winner — Best Contemporary Gospel", sortOrder: 1 },
    { label: "Winner — Best Songwriter", sortOrder: 2 },
    { label: "4 releases · 2017—2025", sortOrder: 3 },
    { label: "Winner — Best Contemporary Gospel (AGA, 2026)", sortOrder: 4 },
  ]);

  console.log("Seeding about...");
  await db.insert(aboutContent).values({
    id: "default",
    bornOn: "16 February 1994",
    basedIn: "Molepolole, Botswana",
    role: "Director, Abed Live",
    training: "Self-taught",
    paragraph1:
      "Abednico Wadingalo is a singer, songwriter and recording artist whose music blends Contemporary Gospel, Afro-Jazz, Praise and Worship. Born 16 February 1994 and based in Molepolole, his sound is rooted in faith, joy and the transformative power of salvation. A self-taught musician and director of Abed Live, he approaches his craft with a deep sense of purpose, infusing his performances with an uplifting energy that resonates with audiences.",
    paragraph2:
      "Beyond music, Abed is a Real Estate Surveyor with a focus on Sustainable Development, embodying a balance between profession and passion. His work extends to vocal training through Transformative Drive, event management with Open Sky Gathering and the Abed Live Moments podcast series.",
    quoteLabel: "His belief",
    quote: "With God, it can only get better.",
  });

  console.log("Seeding discography...");
  await db.insert(releases).values([
    {
      title: "With Kgosi Jeso",
      subtitle: "(Live)",
      kind: "Extended play · Live",
      note: "Latest offering",
      year: 2025,
      isLatest: true,
      coverImageId: coverKgosiJeso.id,
      spotifyUrl: "https://open.spotify.com/album/4xGLUVS2qFZj55Mixuxo2n",
      sortOrder: 0,
    },
    {
      title: "As You Will",
      subtitle: "",
      kind: "Single",
      note: "Studio",
      year: 2019,
      coverImageId: coverAsYouWill.id,
      spotifyUrl: "https://open.spotify.com/album/3THhvMSqaPMdKPDB9pa9Ly",
      sortOrder: 1,
    },
    {
      title: "O Tsholofelo",
      subtitle: "",
      kind: "Live DVD",
      note: "Live in concert · Westwood",
      year: 2018,
      coverImageId: coverOTsholofelo.id,
      spotifyUrl: "https://open.spotify.com/album/5NStkZM40JZTfh4DrP5erv",
      sortOrder: 2,
    },
    {
      // No spotifyUrl: on Spotify this isn't a distinct release — "Phatsima"
      // is a track on the O Tsholofelo album there, not a standalone 2017
      // release. Left as its own release here since that's how it's
      // documented in Abed's own bio material; don't invent a link for it.
      title: "Phatsima",
      subtitle: "",
      kind: "Single · Debut",
      note: "Studio",
      year: 2017,
      coverImageId: coverPhatsima.id,
      sortOrder: 3,
    },
  ]);

  console.log("Seeding top tracks...");
  await db.insert(topTracks).values([
    {
      title: "Jeso Lefika",
      spotifyUrl: "https://open.spotify.com/track/4pGpErjrNlONDpun9JitFF",
      sortOrder: 0,
    },
    {
      title: "Ona Le Nna",
      spotifyUrl: "https://open.spotify.com/track/1HcWP1xgJTy6DQKyBkGv7N",
      sortOrder: 1,
    },
    {
      title: "Kgosi Jeso",
      spotifyUrl: "https://open.spotify.com/track/35MMcM1Qan5GmHTEWofrDR",
      sortOrder: 2,
    },
    {
      title: "Phatsima",
      spotifyUrl: "https://open.spotify.com/track/0zWIxm85kHJaRhCQG8YAeM",
      sortOrder: 3,
    },
    {
      title: "Latela",
      spotifyUrl: "https://open.spotify.com/track/5aITl6CHsSjoPvvqVR0IgO",
      sortOrder: 4,
    },
  ]);

  console.log("Seeding live highlights...");
  await db.insert(liveHighlights).values([
    { title: "Shout Praise Music Concert", subtitle: "Worship leader", sortOrder: 0 },
    { title: "We Praise Music Show", subtitle: "Featured artist", sortOrder: 1 },
    { title: "Contagious Youth Week Festival", subtitle: "Headline set", sortOrder: 2 },
  ]);

  console.log("Seeding Open Sky Gathering...");
  await db.insert(openSkyIntro).values({
    id: "default",
    eyebrow: "Event management · 2022—present",
    title: "Open Sky Gathering",
    body: "Abed's own gathering — five editions of praise, worship, poetry and coffee under an open sky in Molepolole.",
    ctaLabel: "See all editions ↗",
    ctaHref: "#",
  });
  await db.insert(openSkyEditions).values([
    { title: "1st Edition — Imagine Life (2022)", posterImageId: poster1.id, sortOrder: 0 },
    { title: "2nd Edition — To The Light (2023)", posterImageId: poster2.id, sortOrder: 1 },
    { title: "3rd Edition — With God (2024)", posterImageId: poster3.id, sortOrder: 2 },
    { title: "4th Edition — Founded (2025)", posterImageId: poster4.id, sortOrder: 3 },
    { title: "5th Edition — Amplified (2026)", posterImageId: poster5.id, sortOrder: 4 },
  ]);

  console.log("Seeding Beyond Music...");
  await db.insert(beyondMusicItems).values([
    {
      kicker: "Profession",
      title: "Real Estate Surveyor",
      body: "Focused on Sustainable Development — a balance between profession and passion.",
      sortOrder: 0,
    },
    {
      kicker: "Vocal training · 2020",
      title: "Transformative Drive",
      body: "Coaching voices to sing with intention, technique and conviction.",
      sortOrder: 1,
    },
    {
      kicker: "Podcast series",
      title: "Abed Live Moments",
      body: "Conversations from behind the music — process, faith and the road.",
      sortOrder: 2,
    },
    {
      kicker: "Podcast · Season 1 · 2020",
      title: "The Interview",
      body: "Abed Live Moments' debut season.",
      sortOrder: 3,
    },
    {
      kicker: "Podcast · Season 2 · 2021",
      title: "Church Boy Thoughts",
      body: "A 15-episode season of Abed Live Moments.",
      sortOrder: 4,
    },
  ]);

  console.log("Seeding contact + socials...");
  await db.insert(contactInfo).values({
    id: "default",
    email: "abedpraisebeat@gmail.com",
    phonePrimary: "+267 75 951 316",
    phoneSecondary: "74 400 864",
    footerTagline: "Purpose in every note",
    copyrightText: "© 2025 Abed Live",
  });
  // Exactly the buttons/links from Abed's own bio (2026-09), in the same
  // left-to-right order they appear there. No X/Twitter — it's not one of
  // the bio's buttons.
  await db.insert(socialLinks).values([
    { platform: "Facebook", handle: "Abed Live", url: "https://www.facebook.com/AbedWadiengalo/", sortOrder: 0 },
    { platform: "Instagram", handle: "abed_bw", url: "https://www.instagram.com/abed_bw/", sortOrder: 1 },
    { platform: "TikTok", handle: "abedlivebw", url: "https://www.tiktok.com/@abedlivebw", sortOrder: 2 },
    { platform: "YouTube", handle: "Abednico", url: "https://www.youtube.com/channel/UCjgcj9pl0ITW6NdXOgGP0lg", sortOrder: 3 },
  ]);

  console.log("Seeding media slots...");
  await db.insert(mediaSlots).values([
    { slug: "purpose-break", mediaId: pianoHands.id },
  ]);

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
