FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma clients
ENV PRISMA_CLI_BINARY_TARGETS=rhel-openssl-3.0.x
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx prisma generate --schema=prisma/schema.intelligence.prisma

# Provide dummy DB URLs so Next.js can collect page data without a real DB
# These are only used during build — real URLs are set at runtime via Cloud Run env vars
ENV POSTGRES_PRISMA_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV POSTGRES_URL_NON_POOLING="postgresql://dummy:dummy@localhost:5432/dummy"
ENV INTELLIGENCE_DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXTAUTH_SECRET="build-time-dummy-secret"
ENV NEXTAUTH_URL="http://localhost:3000"

# Build Next.js in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma engine binaries
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client-core ./node_modules/@prisma/client-core
COPY --from=builder /app/node_modules/@prisma/client-intelligence ./node_modules/@prisma/client-intelligence

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
