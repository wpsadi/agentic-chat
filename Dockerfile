# ===== Base =====
FROM oven/bun:1 AS base

WORKDIR /app

# copy only manifests first
COPY package.json bun.lock ./
COPY apps/auth-service/package.json ./apps/auth-service/package.json
COPY apps/mail-service/package.json ./apps/mail-service/package.json

# install deps once
RUN bun install --frozen-lockfile --no-optional

# now copy source
COPY . .

# ===== Auth Service Build =====
FROM base AS auth-build

WORKDIR /app/apps/auth-service

RUN bun run build

# ===== Mail Service Build =====
FROM base AS mail-build

WORKDIR /app/apps/mail-service

RUN bun run build

# ===== Final Runtime =====
FROM oven/bun:1 AS runtime

WORKDIR /app

COPY --from=auth-build /app/apps/auth-service/build ./auth
COPY --from=mail-build /app/apps/mail-service/build ./mail

COPY scripts/start.sh ./start.sh

RUN chmod +x start.sh

EXPOSE 12000

CMD ["./start.sh"]