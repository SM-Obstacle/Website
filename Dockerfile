FROM node:26-alpine AS base
# Keep in sync with "packageManager" in package.json
RUN npm install -g bun@1.4.5

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* bun.lock* postcss.config.* codegen.* ./
RUN \
  if [ -f bun.lock ]; then bun i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder

ARG NEXT_PUBLIC_RECORDS_API_URL
ENV NEXT_PUBLIC_RECORDS_API_URL=$NEXT_PUBLIC_RECORDS_API_URL

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f bun.lock ]; then bun run compile && bun run build; \
  elif [ -f yarn.lock ]; then yarn run compile && yarn run build; \
  elif [ -f package-lock.json ]; then npm run compile && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run compile && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# `bun run build` already copies public/ and .next/static/ into the standalone folder
# (see "copy-standalone-assets" in package.json), and the chown also covers the prerender cache.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./

USER nextjs
# Port of the website, set at build time with --build-arg WEBSITE_PORT=...
ARG WEBSITE_PORT=8000
# The standalone server listens on $PORT
ENV PORT=$WEBSITE_PORT
EXPOSE $WEBSITE_PORT

# Listen on all interfaces so the container is reachable from outside
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
