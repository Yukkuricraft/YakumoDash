# Copy src and install packages
FROM node:24-alpine AS node
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml /app/
RUN yarn install

FROM node AS base
COPY nuxt.config.ts tsconfig.json /app/
COPY public/ /app/public/
COPY app/ /app/app/

# Build dev image - just uses nuxt dev - no build
FROM base AS dev
ENTRYPOINT ["nuxt", "dev"]

# Local image - runs nuxt dev server with no auth
FROM base AS local
COPY .env.local /app/
ENTRYPOINT ["nuxt", "dev", "--dotenv", ".env.local"]

# Build dev assets - to be copied into dev nginx image
FROM base AS dev_built
RUN nuxt generate

# Build prod assets - to be copied into prod nginx image
FROM base AS prod_built
ENV NUXT_PUBLIC_PROTOCOL=https
    NUXT_PUBLIC_USE_AUTH=true
    NUXT_PUBLIC_API_HOST=api.yukkuricraft.net
    NUXT_PUBLIC_OPEN_FETCH_YC_API_BASE_URL=https://api.yukkuricraft.net
    NUXT_PUBLIC_FILEBROWSER_HOST=files.yakumo.yukkuricraft.net
    NUXT_PUBLIC_WSS_HOST=docker.yukkuricraft.net
    NUXT_PUBLIC_G_OAUTH2_CLIENT_ID=1084736521175-2b5rrrpcs422qdc5458dhisdsj8auo0p.apps.googleusercontent.com
    NUXT_PUBLIC_MIN_PROXY_PORT=25600
    NUXT_PUBLIC_MAX_PROXY_PORT=25700

RUN nuxt generate

# Nginx - Dev
FROM nginx:1.23.0 AS nginx_dev
COPY --from=dev_built /app/.output/public /usr/share/nginx/html
COPY conf/nginx/default.conf /etc/nginx/conf.d/default.conf

# Nginx - Prod
FROM nginx:1.23.0 AS nginx_prod
COPY --from=prod_built /app/.output/public /usr/share/nginx/html
COPY conf/nginx/default.conf /etc/nginx/conf.d/default.conf
