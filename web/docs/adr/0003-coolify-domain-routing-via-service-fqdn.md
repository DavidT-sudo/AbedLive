# 0003 — Coolify domain routing via `expose:` + `SERVICE_FQDN_<ID>_<PORT>`, not `ports:`

## Status
Accepted — 2026-09-14

## Context
Early staging deploys used `ports:` (host-published) on `app` and
`seaweedfs`, matching a naive read of "how do I make this reachable."
That hit a real host-port collision with a sibling project
(`OmerOhmLABS/portfolio`) already bound to `3000:3000` on the same shared
server. Switching to `expose:` fixed the collision but then produced
"no available server" from Traefik on every domain — the fix was
incomplete on its own.

The instinct to revert back to `ports:` by pattern-matching the sibling
project's working `docker-compose.yaml` was wrong and reintroduced the
same collision — that project's use of `ports:` wasn't *why* it worked.
Actually reading Coolify/Traefik's documented behavior (rather than
pattern-matching a working neighbor) showed the real mechanism.

## Decision
For every service on a Coolify "Docker Compose" resource that needs a
public domain: use `expose:` (internal-only, no host binding) and declare
a `SERVICE_FQDN_<SERVICE>_<PORT>` (or `SERVICE_URL_<SERVICE>_<PORT>`)
environment variable directly in the compose file on that service.
Coolify scans the compose file for these variables and wires Traefik's
routing itself — a domain set only through Coolify's UI "Domains" field
does not reliably apply to Compose-type resources the way it does for
plain image-based "Application" resources.

`ports:` is reserved for the (rare, not currently used) case of bypassing
Coolify's proxy entirely for direct host-interface access.

## Consequences
- No host port collisions are possible between unrelated Coolify
  resources on the same server — every service only ever touches the
  internal Docker network.
- Adding a new publicly-routed service means remembering to add its
  `SERVICE_FQDN_<ID>_<PORT>` var — easy to forget, since nothing fails
  loudly if it's missing (Traefik just returns "no available server").
- `<ID>` must match the service name uppercased with hyphens/dots turned
  into underscores exactly, or Coolify won't recognize it.
- Lesson generalized beyond this one fix: for Coolify/Traefik questions,
  verify against the docs before pattern-matching another working project
  on the same server — a working file's specific choices aren't
  necessarily *why* it works.

**Amendment, 2026-09-15:** `docker-compose.staging.yaml` briefly had
`ports:` reintroduced on `postgres`/`seaweedfs`/`app` the same day — and
it broke the very next deploy (`seaweedfs`'s port `8080` collided with
something else on the shared host, taking the whole resource offline).
`ports:` has been removed again; the file matches this ADR's decision
once more. Full story in
[0008](0008-temporary-ports-on-staging-pending-expose-retest.md) — worth
reading if anyone's ever tempted to add `ports:` back to this file again.
