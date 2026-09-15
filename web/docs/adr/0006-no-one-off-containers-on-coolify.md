# 0006 — No one-off containers of any kind in the Coolify Compose stack

## Status
Accepted — 2026-09-15. Supersedes
[0004](0004-manual-profile-gated-migrations-on-coolify.md).

## Context
0004's fix (profile-gate `migrate`, run it manually via
`docker compose run --rm migrate`) did not hold up. Two compounding
upstream Coolify bugs were involved, discovered in sequence:

1. Coolify does not respect Compose `profiles:` at all
   ([coollabsio/coolify#6395](https://github.com/coollabsio/coolify/issues/6395))
   — it started the profile-gated `migrate` service anyway.
2. Coolify's Compose healthcheck monitor separately misreads *any*
   container in the stack legitimately exiting(0) as "a service went
   down" and tears down the entire stack in response
   ([coollabsio/coolify#7115](https://github.com/coollabsio/coolify/issues/7115)).

So `migrate` started (bug 1 defeated the profile gate), ran, exited 0 as
designed, and Coolify tore down `seaweedfs` and `app` in response (bug
2) — exactly the failure 0004 was meant to prevent, just via a different
path than the one first suspected.

A second attempt renamed `migrate` to `tools`, gave it an inert default
command (`sleep infinity`) so it would idle instead of exiting, and moved
the actual migration into `app`'s own boot sequence
(`db/docker-migrate.mjs`, run by the Dockerfile's `CMD` before the server
starts, using `drizzle-orm`'s own lightweight `postgres-js` migrator
rather than the `drizzle-kit` CLI, since the pruned Next.js standalone
runtime image has no CLI toolchain). This fixed migrations specifically,
but `tools` itself was still a latent risk: a `docker compose run --rm
tools ...` invocation is still part of the same Compose *project*, so if
Coolify's monitor scopes by project label rather than by what it started
via `up`, even a one-off `run` against an idling service could still trip
bug 2. Rather than keep probing an undocumented monitor boundary, the
`tools` service was removed too.

## Decision
No service in `docker-compose.staging.yaml` (or `docker-compose.yml`, for
consistency) is allowed to be one whose normal lifecycle is
start-run-exit — not even behind a `profiles:` gate, and not even as an
idling service meant only to be targeted by `docker compose run`.

- **Schema migrations** run inside `app`'s own container boot, before the
  server starts (`Dockerfile`: `CMD ["sh", "-c", "node db/docker-migrate.mjs && node server.js"]`).
  Nothing about this ever appears as its own service or its own exit
  event.
- **Bucket creation** (one-time, SeaweedFS doesn't auto-create it) uses
  `docker compose exec` against the already-running `seaweedfs`
  container — `exec` runs inside an existing container and creates
  nothing new.
- **`db:seed` and `admin:create`** (genuinely one-time, not safe to run
  automatically) run via a plain `docker build --target builder` +
  `docker run --network <project>_default ...` — entirely outside the
  Compose project, invisible to whatever Coolify's monitor watches.

## Consequences
- The Coolify staging/production stack is now just three long-running
  services (`postgres`, `seaweedfs`, `app`) with nothing else in the
  project — simpler, and structurally immune to both upstream bugs rather
  than working around them.
- Migrations are fully automatic on every deploy again (matching local
  dev's convenience), just implemented differently under the hood:
  `drizzle-orm`'s migrator at boot instead of a Compose dependency graph.
- The Dockerfile now explicitly copies `drizzle-orm`, `postgres`, and
  `drizzle/` into the runner stage, since Next's standalone output tracing
  only bundles what the app's own import graph touches, and the migrator
  sits outside that graph by design — a future dependency bump that
  changes either package's exports should be checked against this copy
  step.
- The one-time setup commands (bucket, seed, admin:create) are no longer
  copy-pasteable `docker compose run` one-liners — they require knowing
  the project's Docker network name (documented in `web/README.md` as
  `<project>_default`, confirmable via `docker network ls`) and passing
  `DATABASE_URL` by hand. Slightly more friction, accepted deliberately
  in exchange for never touching the monitored Compose project.
- If Coolify fixes #6395 and #7115 upstream, this whole workaround family
  could in principle be relaxed — but there's no strong reason to revisit
  it even then, since boot-time migration is arguably simpler regardless
  of Coolify's bugs.
