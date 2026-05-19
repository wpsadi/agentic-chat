# ===== Base =====
FROM oven/bun:1 AS base
WORKDIR /app

COPY . .

# ===== Auth Service Build =====
FROM base AS auth-build
WORKDIR /app/apps/auth-service
RUN bun install
RUN bun run build

# ===== Mail Service Build =====
FROM base AS mail-build
WORKDIR /app/apps/mail-service
RUN bun install
RUN bun run build


# ===== Final Runtime =====
FROM oven/bun:1

WORKDIR /app

# copy outputs from stages
COPY --from=auth-build /app/apps/auth-service/build ./auth
COPY --from=mail-build /app/apps/mail-service/build ./mail
# COPY --from=web-build /app/apps/web/.next ./web

# optional startup script
COPY scripts/start.sh .
RUN chmod +x start.sh

EXPOSE 12000

CMD ["./start.sh"]