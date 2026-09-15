# 0008 — Temporary: `ports:` re-added to staging services, pending an `expose:`-only retest

## Status
Accepted (temporary) — 2026-09-15. Deliberately deviates from
[0003](0003-coolify-domain-routing-via-service-fqdn.md); do not change
either direction without a controlled test (see Next step).

## Context
After the SeaweedFS crash-loop was fixed by baking its entrypoint into a
custom image ([0007](0007-bake-seaweedfs-entrypoint-into-image.md)) and
the stack stabilized, `ports:` was re-added directly to
`docker-compose.staging.yaml` on `postgres` (`5434:5432`), `seaweedfs`
(`8333`, `9333`, `8080`), and `app` (`3000:3000`) — the same file Coolify
deploys from. This is a direct reversal of 0003's `expose:`-only decision,
most likely made for local-testing convenience (this exact pattern —
`abedlive-staging-postgres-1` on host `5434`, `abedlive-staging-app-1` on
host `3000` — was found already running locally on the dev machine).

The server is currently deployed and working with `ports:` present. The
risk 0003 originally documented is real and hasn't gone away: `app` on
host port `3000` previously collided with the `OmerOhmLABS` sibling
project on the same shared Coolify host, and a database
(`postgres`/`seaweedfs`) publishing directly to a host port is its own
exposure risk independent of any collision. But since the deployment is
working right now, the decision was made not to touch it blind — pushing
a config change to a currently-stable production deploy without a plan to
verify it is exactly the kind of unforced-error risk this whole debugging
saga has been about avoiding.

## Decision
Leave `ports:` in place on `docker-compose.staging.yaml` for now. Do not
revert to `expose:`-only until it's been retested and confirmed not to
regress — the file already carries the `SERVICE_FQDN_APP_3000` /
`SERVICE_FQDN_SEAWEEDFS_8333` variables 0003 identified as the actual fix
for Coolify's domain routing (not the ports/expose choice itself), so
there's real reason to expect `expose:`-only would work fine now — but
"should work" isn't the same as "tested," and this deploy has burned a lot
of time on exactly that gap before.

## Consequences
- `app`'s host port `3000` remains a live collision risk with
  `OmerOhmLABS` on the same server until this is resolved one way or the
  other.
- `postgres` and `seaweedfs` remain reachable on host ports on a shared
  server in the meantime — not firewalled off by Coolify's proxy the way
  `expose:`-only services are.
- Local testing convenience and Coolify-deployed correctness are
  currently coupled in one file (`docker-compose.staging.yaml`) — the
  cleaner long-term fix is probably a `docker-compose.staging.override.yml`
  (gitignored, like `docker-compose.override.yml` already is for local
  dev) carrying the `ports:` entries for local-only testing, keeping the
  file Coolify actually deploys from `expose:`-only. Not done yet; flagged
  here so it isn't lost.

## Next step
Before removing `ports:` from `docker-compose.staging.yaml`: redeploy with
`expose:`-only restored, confirm both domains
(`abedlive.omerohmlabs.com`, `abedmedia.omerohmlabs.com`) still resolve
and serve correctly, and confirm no port collision with `OmerOhmLABS`.
Only revert this ADR's decision (back to 0003's original state) once that
test has actually been run — not on the assumption that it'll work.
