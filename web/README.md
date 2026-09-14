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
whole stack is self-hosted and open-source end to end. `next build` never
needs a real database connection (see `app/layout.tsx`), so the image
builds cleanly with no secrets present at build time — every variable
below is only read at container *runtime*.

### Required environment variables

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Local dev / `docker-compose.yml` only — set this. Building it yourself, e.g. `postgresql://abedlive:changeme@postgres:5432/abedlive`. **Do not set this one in Coolify** — `docker-compose.staging.yaml` builds it for you from `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` below, and a compose-level `environment:` value always wins over one from `env_file`/Coolify anyway, so setting it there would be silently ignored. |
| `POSTGRES_USER` | Coolify / `docker-compose.staging.yaml` only. Defaults to `abedlive` if unset. |
| `POSTGRES_PASSWORD` | Coolify / `docker-compose.staging.yaml` only. **Required** — the stack refuses to start without it (no `changeme` default in the staging file). Generate with `openssl rand -hex 24` — **hex, not base64**: this value gets spliced straight into a `postgresql://user:PASSWORD@host/db` connection string, and base64's `/`/`+`/`=` characters corrupt that URL (looks like "wrong password" but isn't). |
| `POSTGRES_DB` | Coolify / `docker-compose.staging.yaml` only. Defaults to `abedlive` if unset. |
| `BETTER_AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Your real public URL, e.g. `https://abedlive.com` |
| `S3_ENDPOINT` | e.g. `http://seaweedfs:8333` inside Compose |
| `S3_REGION` | Any value works for SeaweedFS, e.g. `us-east-1` |
| `S3_BUCKET` | e.g. `abedlive-media` |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Pick any random values (e.g. `openssl rand -hex 16`, twice) — `seaweedfs` generates its S3 identity config from these at container start (`docker/seaweedfs-entrypoint.sh`), so nothing needs editing by hand and no real key ever gets committed to the repo |
| `S3_PUBLIC_URL` | The externally-reachable URL for the bucket, e.g. `https://media.abedlive.com/abedlive-media` — never `localhost` in production |
| `S3_FORCE_PATH_STYLE` | Keep as `"true"` for SeaweedFS |

`cp .env.example .env` and fill these in — that file lists all of them
with local-dev defaults.

### Deploying

There are two compose files:

- `docker-compose.yml` — local development (what the steps above use).
- `docker-compose.staging.yaml` — the staging/production one, for Coolify.
  Same three services, but every long-running container gets a health
  check, a memory/CPU ceiling, rotated logging, and `no-new-privileges`;
  Postgres's credentials come from `POSTGRES_USER` / `POSTGRES_PASSWORD` /
  `POSTGRES_DB` env vars instead of the committed `changeme` dev default
  (the compose file refuses to start without `POSTGRES_PASSWORD` set); and
  it runs under its own Compose project name (`AbedLive-staging`) so it
  never collides with another stack on the same host. The app/migrate
  images are the same multi-stage `Dockerfile` either way — it now also
  carries its own `HEALTHCHECK`.

1. In Coolify: **New Resource → Docker Compose**, point it at this GitHub
   repo, and set the **Base Directory** to `web` (the app isn't at the repo
   root) and **Docker Compose Location** to `docker-compose.staging.yaml`.
2. Enter the environment variables above — plus `POSTGRES_USER`,
   `POSTGRES_PASSWORD`, `POSTGRES_DB` — in Coolify's UI; they get injected
   into the relevant services. Attach your domain to `app` (Coolify handles
   TLS via its built-in reverse proxy) and a second domain to `seaweedfs`
   for `S3_PUBLIC_URL` (media is loaded straight from the S3 gateway in the
   browser, never proxied through `app`).
3. Deploy. This brings up `postgres`, `seaweedfs`, and `app` — `migrate`
   is intentionally excluded from normal startup (it's profile-gated).
   Coolify's Docker Compose healthcheck monitor currently misreads a
   one-off job that exits(0) as "a service went down" and stops the
   whole stack in response (open upstream bug,
   [coollabsio/coolify#7115](https://github.com/coollabsio/coolify/issues/7115)),
   so — unlike plain `docker-compose.yml` — migrations here are run
   manually, every deploy that changes the schema, not automatically.
4. Run the setup commands once per deploy, from a shell on the server
   Coolify deployed to (SSH in, or use Coolify's terminal for that
   server) — `cd` into the deployment directory Coolify created, then:

   ```bash
   # apply pending schema migrations — every deploy that changes the schema
   docker compose run --rm migrate

   # first deploy only: create the media bucket (SeaweedFS doesn't auto-create it)
   docker compose run --rm seaweedfs weed shell -master=seaweedfs:9333 \
     <<< "s3.bucket.create -name abedlive-media"

   # first deploy only: seed Abed's real content — not upsert-safe, run once only
   docker compose run --rm migrate npm run db:seed

   # first deploy only: bootstrap the first admin — see below
   docker compose run --rm migrate npm run admin:create -- \
     --email you@example.com --password "..." --name "Your Name"
   ```

The bucket/seed/admin:create block only runs once, on first deploy —
but `docker compose run --rm migrate` needs to be repeated after every
deploy that adds a new migration.

### Adding the first admin user

There's no public sign-up page by design (this is a small brand site's
CMS, not a multi-tenant app) — the first admin has to be created directly
against the database with `npm run admin:create`, shown above for Coolify.
Locally, or against any other externally-reachable database, it's the same
command without Docker:

```bash
DATABASE_URL=... BETTER_AUTH_SECRET=... npm run admin:create -- \
  --email you@example.com --password "..." --name "Your Name"
```

After that, sign in at `/admin` and add the rest of the team from
`/admin/team` — that admin can create further `admin` or `editor` accounts
through the normal UI, no shell access needed again.

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
