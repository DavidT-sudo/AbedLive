# 0004 — Run DB migrations as a manual, profile-gated one-off on Coolify

## Status
Superseded by [0006](0006-no-one-off-containers-on-coolify.md) — 2026-09-15.
Kept for the historical record: this was the first fix attempted, and it
turned out to be necessary-but-insufficient, which is itself the reason
0006 exists. Do not reapply this approach.

## Context
Local dev auto-runs migrations on every `docker compose up` via a
`migrate` service that the `app` service's `depends_on` gates behind
(`condition: service_completed_successfully`) — a normal, convenient
Compose pattern. Porting that same pattern to `docker-compose.staging.yaml`
caused every Coolify deploy to look successful (all containers start,
`migrate` exits 0 as designed) and then have the **entire stack** —
postgres, seaweedfs, app, everything — gracefully stopped roughly 60-90
seconds later, with no second deploy and nothing user-initiated.

This matches an open upstream Coolify bug
([coollabsio/coolify#7115](https://github.com/coollabsio/coolify/issues/7115)):
Coolify's Docker Compose healthcheck monitor misreads a one-off job's
clean `exit(0)` as "a service in this resource went down" and stops the
whole resource in response. The documented `exclude_from_hc` workaround is
itself unreliable per
[coollabsio/coolify#6591](https://github.com/coollabsio/coolify/issues/6591).

## Decision
`migrate` is `profiles: ["tools"]` in the Coolify staging file — excluded
from the default monitored `up` set entirely, not referenced in any other
service's `depends_on`. It's run manually, once per deploy that changes
the schema, via `docker compose run --rm migrate` from a shell on the
Coolify host. `docker-compose.yml` (local dev) keeps the automatic
`depends_on`/`service_completed_successfully` pattern unchanged, since it
never goes through Coolify's monitor and isn't affected by the bug.

## Consequences
- Every schema-changing deploy now has a manual step (documented in
  `web/README.md`) instead of being fully automatic — easy to forget,
  and migrations can silently lag behind a deploy if skipped.
- This was necessary but **not sufficient** on its own: a later staging
  deploy with `migrate` already excluded still showed the same
  60-90-second whole-stack teardown, this time traced to a different
  cause entirely (`seaweedfs` crash-looping — see
  [0002](0002-runtime-generated-seaweedfs-credentials.md)). Coolify's
  monitor appears to react the same way to *any* container repeatedly
  restarting inside a monitored Compose resource, not only to one-off
  jobs exiting 0 — treat that as the broader lesson, not just the
  `migrate`-specific one.
- If Coolify fixes #7115 upstream, this workaround (and its corresponding
  README step) can be reverted back to the local-dev auto-migrate pattern.
