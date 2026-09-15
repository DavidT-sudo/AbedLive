# 0002 — Generate SeaweedFS S3 credentials at container runtime, not commit them

## Status
Accepted — 2026-09-14

## Context
SeaweedFS's S3 gateway reads its identities (access key / secret key) from
a JSON config file (`s3.json`). The first pass committed this file to the
repo with real generated keys baked in as static values, then attempted to
push it — Claude Code's own credential-leakage classifier blocked the
push, correctly flagging plaintext secrets headed to a public/shared repo.

## Decision
Delete the static `docker/seaweedfs-s3-config.json` entirely. Replace it
with `docker/seaweedfs-entrypoint.sh`, which the `seaweedfs` service runs
as its container `entrypoint`: it reads `S3_ACCESS_KEY_ID` /
`S3_SECRET_ACCESS_KEY` from the environment (set in Coolify's UI / local
`.env`, never in git) and writes `/etc/seaweedfs/s3.json` via a heredoc at
container start, before `exec`-ing into `weed` itself.

## Consequences
- No real secret ever exists in the git history — only a generation
  recipe does.
- Rotating a key is now "change the env var and redeploy," not "edit and
  recommit a file."
- Adds one more moving part (a shell script + volume-mounted script file)
  to the Compose service, which turned out to have its own failure mode:
  on Coolify specifically, if the entrypoint script doesn't exist yet in
  the checked-out deploy directory at the moment Docker first resolves the
  bind mount, Docker silently creates an empty **directory** at that host
  path instead of erroring — and because Coolify's redeploy is an
  incremental sync rather than a clean re-clone, that stray directory
  persists and shadows the real file on every subsequent deploy, even
  after the file exists in git. This caused `seaweedfs` to crash-loop
  silently (instant exit, zero log output, `RestartCount` climbing) until
  the stray directory was manually removed on the host
  (`rmdir .../docker/seaweedfs-entrypoint.sh`) and a fresh deploy re-ran
  the checkout. Worth remembering if a *new* bind-mounted file is ever
  added to a Coolify service: the very first deploy that references it
  must happen with the file already present in the tracked commit.
- The keys pasted in chat during initial setup
  (`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`) should be rotated once
  staging is stable, since they were exposed in plaintext conversation
  even though never committed to git.
