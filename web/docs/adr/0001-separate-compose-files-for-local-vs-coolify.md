# 0001 — Separate Compose files for local dev vs. Coolify staging/production

## Status
Accepted — 2026-09-14

## Context
The app needs a local development stack (Postgres, SeaweedFS, the Next.js
app) and a production-hosted stack on Coolify. A single shared
`docker-compose.yml` with profiles/overrides was considered, but local dev
and Coolify have genuinely different requirements: local dev wants
throwaway `changeme` credentials, host-published ports for direct access,
and auto-migrate-on-boot for a fast inner loop; Coolify needs
Coolify-specific env-var-sourced credentials, resource limits, health
checks, rotated logging, `no-new-privileges`, and — critically — must
route domains and avoid its own known bugs around one-off jobs (see
[0004](0004-manual-profile-gated-migrations-on-coolify.md)).

## Decision
Keep two independent Compose files:
- `docker-compose.yml` (+ `docker-compose.override.yml`) — local development.
- `docker-compose.staging.yaml` — the Coolify-hosted resource, under its own
  Compose project name (`AbedLive-staging`) so it never collides with
  another stack on the same shared host.

Both build through the same multi-stage, `output: standalone` `Dockerfile`,
so the image itself is never forked — only the Compose-level configuration
(env source, ports/expose, health checks, resource limits) differs.

## Consequences
- A change to one stack's shape (e.g. adding a service) has to be
  consciously mirrored into the other file — there is no single source of
  truth for "the stack," only for "the image."
- Local dev keeps a fast, low-friction loop (auto-migrate, throwaway
  creds, direct host ports) without those choices leaking into production
  where they'd be actively harmful (auto-migrate on Coolify triggers an
  upstream bug — see 0004; host-published ports fight Coolify's proxy —
  see [0003](0003-coolify-domain-routing-via-service-fqdn.md)).
- `web/README.md` documents both paths and must be kept in sync with
  whichever file changes.
