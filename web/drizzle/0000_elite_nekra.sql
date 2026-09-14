CREATE TABLE "about_content" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"born_on" text DEFAULT '16 February 1994' NOT NULL,
	"based_in" text DEFAULT 'Molepolole, Botswana' NOT NULL,
	"role" text DEFAULT 'Director, Abed Live' NOT NULL,
	"training" text DEFAULT 'Self-taught' NOT NULL,
	"paragraph1" text DEFAULT '' NOT NULL,
	"paragraph2" text DEFAULT '' NOT NULL,
	"quote_label" text DEFAULT 'His belief' NOT NULL,
	"quote" text DEFAULT 'With God, it can only get better.' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "award_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beyond_music_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kicker" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_info" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone_primary" text DEFAULT '' NOT NULL,
	"phone_secondary" text DEFAULT '' NOT NULL,
	"footer_tagline" text DEFAULT 'Purpose in every note' NOT NULL,
	"copyright_text" text DEFAULT '© 2025 Abed Live' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_content" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"kicker" text DEFAULT '• MUSICIAN •' NOT NULL,
	"title_line1" text DEFAULT 'ABED' NOT NULL,
	"title_line2" text DEFAULT 'LIVE' NOT NULL,
	"location_line" text DEFAULT 'Molepolole · Botswana' NOT NULL,
	"genre_line" text DEFAULT 'Contemporary Gospel · Afro-Jazz · Praise & Worship' NOT NULL,
	"release_note" text DEFAULT 'With Kgosi Jeso (Live) — out now' NOT NULL,
	"release_cta_label" text DEFAULT 'Listen ↗' NOT NULL,
	"release_cta_href" text DEFAULT '#' NOT NULL,
	"image_id" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "live_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"content_type" text,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_slots" (
	"slug" text PRIMARY KEY NOT NULL,
	"media_id" uuid
);
--> statement-breakpoint
CREATE TABLE "open_sky_editions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"poster_image_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "open_sky_intro" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"eyebrow" text DEFAULT 'Event management · 2022—present' NOT NULL,
	"title" text DEFAULT 'Open Sky Gathering' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"cta_label" text DEFAULT 'See all editions ↗' NOT NULL,
	"cta_href" text DEFAULT '#' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '',
	"kind" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"year" integer NOT NULL,
	"is_latest" boolean DEFAULT false NOT NULL,
	"cover_image_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"theme" text DEFAULT 'press' NOT NULL,
	"site_title" text DEFAULT 'Abed Live' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"handle" text DEFAULT '' NOT NULL,
	"url" text DEFAULT '#' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hero_content" ADD CONSTRAINT "hero_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_slots" ADD CONSTRAINT "media_slots_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "open_sky_editions" ADD CONSTRAINT "open_sky_editions_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "releases" ADD CONSTRAINT "releases_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");