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
  console.log("Seeding local media rows...");
  const [
    portrait,
    coverKgosiJeso,
    coverAsYouWill,
    coverOTsholofelo,
    coverPhatsima,
    poster2,
    poster3,
    poster4,
    pianoHands,
  ] = await Promise.all([
    upsertMedia("portrait-white-jacket.png", "Abednico Wadingalo on stage"),
    upsertMedia("cover-kgosi-jeso.png", "With Kgosi Jeso (Live)"),
    upsertMedia("cover-as-you-will.png", "As You Will"),
    upsertMedia("cover-o-tsholofelo.png", "O Tsholofelo Live DVD"),
    upsertMedia("cover-phatsima.png", "Phatsima"),
    upsertMedia("poster-opensky-2.png", "Open Sky Gathering 2nd Edition"),
    upsertMedia("poster-opensky-3.png", "Open Sky Gathering 3rd Edition"),
    upsertMedia("poster-opensky-4.png", "Open Sky Gathering 4th Edition"),
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
      sortOrder: 0,
    },
    {
      title: "As You Will",
      subtitle: "",
      kind: "Single",
      note: "Studio",
      year: 2019,
      coverImageId: coverAsYouWill.id,
      sortOrder: 1,
    },
    {
      title: "O Tsholofelo",
      subtitle: "",
      kind: "Live DVD",
      note: "Live in concert",
      year: 2018,
      coverImageId: coverOTsholofelo.id,
      sortOrder: 2,
    },
    {
      title: "Phatsima",
      subtitle: "",
      kind: "Album · Debut",
      note: "Studio",
      year: 2017,
      coverImageId: coverPhatsima.id,
      sortOrder: 3,
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
    body: "Abed's own gathering — four editions of praise, worship, poetry and coffee under an open sky in Molepolole.",
    ctaLabel: "See all editions ↗",
    ctaHref: "#",
  });
  await db.insert(openSkyEditions).values([
    { title: "2nd Edition", posterImageId: poster2.id, sortOrder: 0 },
    { title: "3rd Edition", posterImageId: poster3.id, sortOrder: 1 },
    { title: "4th Edition", posterImageId: poster4.id, sortOrder: 2 },
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
  await db.insert(socialLinks).values([
    { platform: "Instagram", handle: "abed_bw", url: "#", sortOrder: 0 },
    { platform: "Facebook", handle: "ABed Live", url: "#", sortOrder: 1 },
    { platform: "YouTube", handle: "abedlivebw", url: "#", sortOrder: 2 },
    { platform: "X", handle: "Abednico", url: "#", sortOrder: 3 },
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
