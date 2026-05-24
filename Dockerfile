FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/* \
    && corepack enable && corepack prepare pnpm@10.33.3 --activate

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build

FROM base AS runtime
WORKDIR /app

COPY --from=build /app/dist        ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/server/entry.mjs"]
