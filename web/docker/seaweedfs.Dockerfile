# Bakes the S3-credential entrypoint script into the image at build time,
# instead of bind-mounting it from the host at container start. A
# bind-mounted script depends on its host path existing at the moment
# Docker resolves the mount; if it doesn't, Docker silently creates an
# empty *directory* there instead of erroring. On Coolify specifically,
# the deployment directory is never cleaned between deploys — so one bad
# timing (or, in this repo's history, a file later deleted from git
# entirely) leaves a permanently-broken directory shadowing the real file
# on every future deploy, no matter how many times the correct file is
# pushed. It recurred twice in this repo's history for exactly that
# reason (see web/docs/adr/0007-bake-seaweedfs-entrypoint-into-image.md).
# Baking the script into the image removes the host path — and the whole
# bug class — entirely.
FROM chrislusf/seaweedfs:latest
COPY seaweedfs-entrypoint.sh /docker/seaweedfs-entrypoint.sh
ENTRYPOINT ["/bin/sh", "/docker/seaweedfs-entrypoint.sh"]
