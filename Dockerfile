# ===== Base =====
FROM oven/bun:1 AS base

WORKDIR /app

# root manifests
COPY package.json bun.lock turbo.json ./

# workspace manifests
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# app manifests
COPY apps/auth-service/package.json ./apps/auth-service/package.json
COPY apps/mail-service/package.json ./apps/mail-service/package.json

# install deps
RUN bun install --frozen-lockfile

# copy remaining source
COPY . .

# ===== Auth Build =====
FROM base AS auth-build

WORKDIR /app/apps/auth-service

RUN bun run build

# ===== Mail Build =====
FROM base AS mail-build

WORKDIR /app/apps/mail-service

RUN bun run build

# ===== Runtime =====
FROM oven/bun:1 AS runtime

WORKDIR /app

COPY --from=auth-build /app/apps/auth-service/build ./auth
COPY --from=mail-build /app/apps/mail-service/build ./mail

COPY scripts/start.sh ./start.sh

RUN chmod +x start.sh

EXPOSE 12000

CMD ["./start.sh"]