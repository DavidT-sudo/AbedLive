import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export * from "./auth-schema";

// ---------------------------------------------------------------------------
// Media — files uploaded to SeaweedFS (S3-compatible), referenced by content
// ---------------------------------------------------------------------------
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull(), // object key in the SeaweedFS bucket
  url: text("url").notNull(), // public URL to read it back
  alt: text("alt").notNull().default(""),
  contentType: text("content_type"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Site settings — singleton row. `theme` picks the active design direction
// ("press" = 1a Press Sheet, "open-sky" = 1b, kept ready for later).
// ---------------------------------------------------------------------------
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  theme: text("theme").notNull().default("press"),
  siteTitle: text("site_title").notNull().default("Abed Live"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Hero — the full-bleed header section
// ---------------------------------------------------------------------------
export const heroContent = pgTable("hero_content", {
  id: text("id").primaryKey().default("default"),
  kicker: text("kicker").notNull().default("• MUSICIAN •"),
  titleLine1: text("title_line1").notNull().default("ABED"),
  titleLine2: text("title_line2").notNull().default("LIVE"),
  locationLine: text("location_line").notNull().default("Molepolole · Botswana"),
  genreLine: text("genre_line")
    .notNull()
    .default("Contemporary Gospel · Afro-Jazz · Praise & Worship"),
  releaseNote: text("release_note").notNull().default("With Kgosi Jeso (Live) — out now"),
  releaseCtaLabel: text("release_cta_label").notNull().default("Listen ↗"),
  releaseCtaHref: text("release_cta_href").notNull().default("#"),
  imageId: uuid("image_id").references(() => media.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Awards / stats strip
// ---------------------------------------------------------------------------
export const awardStats = pgTable("award_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------------------------------------------------------------------
// About section
// ---------------------------------------------------------------------------
export const aboutContent = pgTable("about_content", {
  id: text("id").primaryKey().default("default"),
  bornOn: text("born_on").notNull().default("16 February 1994"),
  basedIn: text("based_in").notNull().default("Molepolole, Botswana"),
  role: text("role").notNull().default("Director, Abed Live"),
  training: text("training").notNull().default("Self-taught"),
  paragraph1: text("paragraph1").notNull().default(""),
  paragraph2: text("paragraph2").notNull().default(""),
  quoteLabel: text("quote_label").notNull().default("His belief"),
  quote: text("quote").notNull().default("With God, it can only get better."),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Discography
// ---------------------------------------------------------------------------
export const releases = pgTable("releases", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").default(""), // e.g. "(Live)"
  kind: text("kind").notNull().default(""), // e.g. "Extended play · Live"
  note: text("note").notNull().default(""), // e.g. "Latest offering"
  year: integer("year").notNull(),
  isLatest: boolean("is_latest").notNull().default(false),
  coverImageId: uuid("cover_image_id").references(() => media.id),
  // A track, album, or artist URL from open.spotify.com — rendered as the
  // official Spotify embed player. Validated/parsed in lib/spotify.ts before
  // ever reaching an <iframe>, so a bad paste here can't inject raw HTML.
  spotifyUrl: text("spotify_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------------------------------------------------------------------
// Live — highlight cards (Shout Praise, We Praise, ...)
// ---------------------------------------------------------------------------
export const liveHighlights = pgTable("live_highlights", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Open Sky Gathering intro copy (singleton)
export const openSkyIntro = pgTable("open_sky_intro", {
  id: text("id").primaryKey().default("default"),
  eyebrow: text("eyebrow").notNull().default("Event management · 2022—present"),
  title: text("title").notNull().default("Open Sky Gathering"),
  body: text("body").notNull().default(""),
  ctaLabel: text("cta_label").notNull().default("See all editions ↗"),
  ctaHref: text("cta_href").notNull().default("#"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Open Sky Gathering posters/editions
export const openSkyEditions = pgTable("open_sky_editions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(), // e.g. "2nd Edition"
  posterImageId: uuid("poster_image_id").references(() => media.id),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------------------------------------------------------------------
// Beyond Music
// ---------------------------------------------------------------------------
export const beyondMusicItems = pgTable("beyond_music_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  kicker: text("kicker").notNull().default(""), // e.g. "Profession"
  title: text("title").notNull(), // e.g. "Real Estate Surveyor"
  body: text("body").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------------------------------------------------------------------
// Contact + socials + footer
// ---------------------------------------------------------------------------
export const contactInfo = pgTable("contact_info", {
  id: text("id").primaryKey().default("default"),
  email: text("email").notNull().default(""),
  phonePrimary: text("phone_primary").notNull().default(""),
  phoneSecondary: text("phone_secondary").notNull().default(""),
  footerTagline: text("footer_tagline").notNull().default("Purpose in every note"),
  copyrightText: text("copyright_text").notNull().default("© 2025 Abed Live"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Named decorative image slots that don't warrant their own content table
// (e.g. the "purpose in every note" break banner). Slug is the lookup key.
export const mediaSlots = pgTable("media_slots", {
  slug: text("slug").primaryKey(),
  mediaId: uuid("media_id").references(() => media.id),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  platform: text("platform").notNull(), // e.g. "Instagram"
  handle: text("handle").notNull().default(""), // e.g. "abed_bw"
  url: text("url").notNull().default("#"),
  sortOrder: integer("sort_order").notNull().default(0),
});
