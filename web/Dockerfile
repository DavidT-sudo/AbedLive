# syntax=docker/dockerfile:1

FROM node:22-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Not read at runtime — only present so `next build` doesn't fail while
# tracing modules that read DATABASE_URL at import time. Real values are
# supplied as container env vars at `docker run` / compose time.
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"
ENV BETTER_AUTH_SECRET="build-time-placeholder-not-used-at-runtime"
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Next's standalone output only bundles what it traces through the app's own
# import graph, which never imports the migrator (db/docker-migrate.mjs is
# outside that graph by design — see its own comment). Copy these two
# packages in full so `drizzle-orm/postgres-js/migrator` is guaranteed
# present rather than relying on tracing to have picked up that sub-path.
COPY --from=deps /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=deps /app/node_modules/postgres ./node_modules/postgres
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/db/docker-migrate.mjs ./db/docker-migrate.mjs

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# No curl/wget in the slim base — use Node's own http client so the image
# doesn't need extra packages just to report readiness.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["sh", "-c", "node db/docker-migrate.mjs && node server.js"]
