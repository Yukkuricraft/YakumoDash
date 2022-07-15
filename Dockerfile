# Copy src and install packages.json
FROM node:14.20-alpine AS node
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app
COPY . /app

RUN yarn install

# Build Ng
FROM node AS build
RUN yarn run build

# Nginx

FROM nginx:1.23.0
COPY --from=build /app/dist/yakumo-dash /usr/share/nginx/html
