FROM node:22-bookworm-slim AS app

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN mkdir -p /app/data /app/public/uploads \
    && DATABASE_URL=file:/app/data/build.db npx prisma generate --config prisma7.config.ts \
    && DATABASE_URL=file:/app/data/build.db npx prisma migrate deploy --config prisma7.config.ts \
    && DATABASE_URL=file:/app/data/build.db npm run build \
    && rm -f /app/data/build.db

ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/dev.db
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && exec npm start"]
