# Copy src and install packages.json
FROM node:22-alpine AS node
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app
COPY package.json /app
COPY src/ /app/src
COPY yarn.lock /app

RUN yarn install

# Build dev image - just uses ng serve - no build
FROM node AS dev
COPY angular.json /app
COPY tsconfig.app.json /app
COPY tsconfig.json /app

ENTRYPOINT ["yarn", "serve:dev"]

# Build dev assets - to be copied into dev nginx image
FROM dev as dev_built
RUN yarn build:dev

# Build prod assets - to be copied into prod nginx image
FROM dev AS prod_built
RUN yarn build:prod

# Nginx - Dev
FROM nginx:1.23.0 as nginx_dev
COPY --from=dev_built /app/dist/yakumo-dash /usr/share/nginx/html
COPY conf/nginx/default.conf /etc/nginx/conf.d/default.conf

# Nginx - Prod
FROM nginx:1.23.0 as nginx_prod
COPY --from=prod_built /app/dist/yakumo-dash /usr/share/nginx/html
COPY conf/nginx/default.conf /etc/nginx/conf.d/default.conf
