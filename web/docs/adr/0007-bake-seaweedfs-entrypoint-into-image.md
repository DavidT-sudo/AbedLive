# 0007 — Bake the SeaweedFS entrypoint script into a custom image, don't bind-mount it

## Status
Accepted — 2026-09-15.

## Context
[0002](0002-runtime-generated-seaweedfs-credentials.md) generates
`seaweedfs`'s S3 identity config at container start from a script
(`docker/seaweedfs-entrypoint.sh`) bind-mounted into the stock
`chrislusf/seaweedfs:latest` image. This depends on the host path
existing at the exact moment Docker resolves the bind mount. If it
doesn't, Docker doesn't error — it silently creates an empty **directory**
at that host path instead, and the container's entrypoint then fails to
open "the script" (actually a directory) and exits near-instantly with a
misleadingly clean exit code and zero log output.

On Coolify's shared host, this bit AbedLive's staging deploy **twice**:
- First, some time before this session, for `docker/seaweedfs-s3-config.json`
  — a file that was later deleted from git entirely (0002) — yet an empty
  directory of that exact name was still sitting in Coolify's deployment
  directory on 2026-09-15, dated back to the very first deploy attempt.
- Second, for `docker/seaweedfs-entrypoint.sh` itself: diagnosed via
  `docker inspect` showing `RestartCount=10` and ~300ms start-to-finish
  cycles with zero log output, confirmed by `ls -la` showing the path as
  a directory and `cat` failing with "Is a directory". Manually removing
  the stray directory (`rmdir`) and redeploying fixed it — but it came
  back after the *next* deploy, in the same broken state.

The recurrence proves Coolify's deployment directory for a Compose
resource is never cleaned between deploys — it only ever gains files, and
a stray auto-vivified directory is never replaced by a real file from a
later git checkout, no matter how many times the correct commit is
pushed. This is also very likely what was tripping the whole-stack
teardown from [0004](0004-manual-profile-gated-migrations-on-coolify.md)/
[0006](0006-no-one-off-containers-on-coolify.md): a container that
restarts 10 times in a loop is a much more plausible trigger for
Coolify's "something in this stack is unhealthy" monitor than the one-off
jobs originally suspected — 0006 was real and worth keeping, but was not
the actual root cause of every teardown observed.

## Decision
Stop bind-mounting the entrypoint script. Build a small custom image
instead (`docker/seaweedfs.Dockerfile`: `FROM chrislusf/seaweedfs:latest`
+ `COPY seaweedfs-entrypoint.sh` + `ENTRYPOINT`), referenced from both
compose files via `build: { context: ./docker, dockerfile:
seaweedfs.Dockerfile }`. The script becomes part of the built image layer
instead of a host filesystem dependency — there is no host path left for
Coolify's directory-hoarding behavior to ever corrupt.

## Consequences
- This class of bug cannot recur for `seaweedfs`, on any host, regardless
  of how that host's deployment directory is managed.
- `seaweedfs` now takes a `docker build` step on every deploy (a few
  seconds, layered on `chrislusf/seaweedfs:latest`) instead of a plain
  `image:` pull — a minor deploy-time cost in exchange for structural
  reliability.
- The general lesson generalizes past SeaweedFS: **any future
  bind-mounted file in a Coolify Compose resource carries this same risk**
  and should default to being baked into an image at build time instead,
  unless there's a specific reason the file must be host-editable after
  deploy (e.g. something an operator edits by hand on the server).
- The stray `docker/seaweedfs-s3-config.json` and
  `docker/seaweedfs-entrypoint.sh` directories left on the Coolify host's
  `applications/<uuid>/docker/` path are now permanently harmless (nothing
  references those paths anymore) but can be `rmdir`'d for tidiness; not
  required for correctness.
