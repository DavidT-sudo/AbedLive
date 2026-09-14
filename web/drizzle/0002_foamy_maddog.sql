CREATE TABLE "top_tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"spotify_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
