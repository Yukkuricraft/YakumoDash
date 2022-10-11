# Copy src and install packages.json
FROM node:14.20-alpine AS node
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app
COPY package.json /app
COPY src/ /app/src
COPY yarn.lock /app

RUN yarn install

# Build Ng
FROM node AS dev
COPY angular.json /app
COPY tsconfig.app.json /app
COPY tsconfig.json /app

RUN yarn build

# Nginx

FROM nginx:1.23.0
COPY --from=build /app/dist/yakumo-dash /usr/share/nginx/html
