# Dev-only image for the "app" service — not related to the production
# Dockerfile at web/Dockerfile (multi-stage, standalone build, used by
# docker-compose.yml / docker-compose.staging.yaml for actual deploys).
# This one just needs a shell, git, and Node; the real app code is bind-
# mounted in by docker-compose.yml in this same directory, and dependencies
# are installed after the container starts (see devcontainer.json's
# postCreateCommand) so `npm ci` always matches whatever's actually on disk.
FROM node:22

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Keeps the container running so an editor/CLI can attach and exec into it;
# the developer starts `npm run dev` themselves in an interactive terminal
# so hot-reload output stays visible, rather than it running backgrounded.
CMD ["sleep", "infinity"]
