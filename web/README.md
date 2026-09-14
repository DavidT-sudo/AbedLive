# Abed Live — abedlive.com

Abednico Wadingalo's brand website, built as a small CMS so Abed's team can
edit everything without touching code.

- **Framework:** Next.js 16 (App Router)
- **Database:** Postgres via Drizzle ORM
- **Auth:** Better Auth (email/password, admin + editor roles)
- **Media storage:** any S3-compatible store — self-hosted with SeaweedFS
- **Design:** implements the "Press Sheet" direction (1a) from the Claude
  Design handoff; built with theme tokens so a future "Open Sky" (1b) theme
  is a palette/font swap, not a rebuild (see `app/globals.css`).

## Local development

Prerequisites: Node 20.9+, a Postgres database, an S3-compatible bucket
(SeaweedFS, MinIO, or real S3 all work for local dev).

```bash
cp .env.example .env   # fill in DATABASE_URL, BETTER_AUTH_SECRET, S3_*
npm install
npm run db:migrate     # create tables
npm run db:seed        # populate Abed's real bio content
npm run admin:create -- --email you@example.com --password "..." --name "Your Name"
npm run dev
```

Visit `http://localhost:3000` for the public site and `/admin` to sign in
and edit content.

Generate a secret for `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.

## Content model

Everything editable from `/admin` lives in Postgres (`db/schema.ts`):
hero, awards strip, about, discography, live highlights, Open Sky Gathering
(intro + editions), Beyond Music, contact/socials, and site settings
(including the theme switch reserved for the future 1b design). Images
upload straight to the S3-compatible bucket and are tracked in a `media`
table.

There is no public sign-up — the first admin is created with
`npm run admin:create`, and that admin adds teammates from `/admin/team`
(Better Auth's admin plugin: roles are `admin` and `editor`).

## Self-hosting (Coolify / any Docker host)

The app ships as a multi-stage `Dockerfile` (Next.js `output: "standalone"`)
plus a `docker-compose.yml` with Postgres and SeaweedFS included, so the
whole stack is self-hosted and open-source end to end.

1. Copy `.env.example` to `.env` and fill in real secrets. In particular:
   - `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` must match
     `docker/seaweedfs-s3-config.json` (replace the `changeme` placeholders
     in **both** places with the same values).
   - `S3_PUBLIC_URL` should be the externally-reachable URL for the
     SeaweedFS S3 gateway + bucket (e.g. behind a reverse proxy at
     `https://media.abedlive.com/abedlive-media`), not `localhost`.
   - `DATABASE_URL` / `BETTER_AUTH_URL` should point at the `postgres`
     service and your real public domain respectively.

2. Bring the stack up:

   ```bash
   docker compose up -d postgres seaweedfs
   # create the media bucket (SeaweedFS doesn't auto-create it)
   docker compose run --rm seaweedfs weed shell -master=seaweedfs:9333 \
     <<< "s3.bucket.create -name abedlive-media"
   docker compose run --rm migrate
   docker compose up -d app
   ```

3. Bootstrap the first admin:

   ```bash
   docker compose run --rm migrate npm run admin:create -- \
     --email you@example.com --password "..." --name "Your Name"
   ```

**On Coolify:** point a Coolify "Docker Compose" resource at this repo — it
will pick up `docker-compose.yml` directly. Set the same environment
variables in Coolify's UI (they're injected into the `app` service),
attach a domain with Coolify's built-in reverse proxy/TLS, and run the
`migrate` one-off command from Coolify's terminal the first time.

## Deploying to Vercel instead

Vercel can host the Next.js app itself, but not the self-hosted Postgres
or SeaweedFS containers — those need to live elsewhere reachable over the
network (e.g. a small VPS running just `docker compose up postgres
seaweedfs`, or managed equivalents like Vercel Postgres / Neon for the
database and any S3-compatible bucket for media, since the storage layer
already speaks the S3 API). Steps:

1. Push this repo to GitHub and import it in Vercel.
2. Set the same environment variables from `.env.example` in the Vercel
   project settings, pointed at your externally-hosted Postgres and S3
   endpoint.
3. Run migrations once from your machine against that database:
   `DATABASE_URL=... npm run db:migrate && npm run db:seed`.
4. Bootstrap the first admin the same way:
   `DATABASE_URL=... BETTER_AUTH_SECRET=... npm run admin:create -- --email ... --password ...`.

## Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server / production build / start |
| `npm run db:generate` | Generate a new Drizzle migration after a schema change |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed the real Abed Live content (safe to run once, on an empty DB) |
| `npm run db:studio` | Open Drizzle Studio to browse the database |
| `npm run admin:create` | Bootstrap the first admin user |
| `npm run auth:generate` | Regenerate Better Auth's Drizzle schema after changing `lib/auth.ts` |
