# 0008 — Temporary: `ports:` re-added to staging services, pending an `expose:`-only retest

## Status
**Reverted, 2026-09-15 (same day).** The retest this ADR called for
happened faster than planned — not as a controlled test, but because the
very next Coolify redeploy failed outright. `ports:` has been removed
from `docker-compose.staging.yaml` again; the file now matches
[0003](0003-coolify-domain-routing-via-service-fqdn.md) once more. See
Resolution below.

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

## Resolution
The very next redeploy after this ADR was written (commit `e20ba1b`,
2026-09-15 11:47) failed outright:

```
Error response from daemon: failed to set up container networking:
driver failed programming external connectivity on endpoint
seaweedfs-trhkib2ylcxj0avc0klkzewc-094723146935: Bind for 0.0.0.0:8080
failed: port is already allocated
```

`seaweedfs`'s `ports: - "8080:8080"` collided with something else already
bound to `8080` on the shared host. Coolify had already removed the old
containers before attempting to start the new ones, so the deploy left
the resource with no running `app`/`seaweedfs` at all — both
`abedlive.omerohmlabs.com` and `abedmedia.omerohmlabs.com` returned
Traefik's "no available server" until this was fixed. This is the same
class of failure 0003 originally documented (a port collision on a shared
host caused by `ports:`), just on `8080` instead of `3000` this time —
confirming the risk this ADR flagged was real, not hypothetical.

`ports:` has been removed from `postgres`, `seaweedfs`, and `app` in
`docker-compose.staging.yaml`. The file is back to `expose:`-only,
matching 0003. The `docker-compose.staging.override.yml` idea from
Consequences (above) is still the right way to get local host-port access
for testing without risking this again — worth doing before anyone next
needs local access to the staging stack's containers.
