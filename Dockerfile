# 1. Build Stage (Bun for install + build)
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# 2. Run Stage (Node runtime)
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/.output ./

ENV NITRO_PORT=8080
ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE 8080
CMD ["node", "server/index.mjs"]
