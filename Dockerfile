# Build Ng
FROM node:14.15-alpine AS node
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app
COPY . /app

RUN yarn run build

# Nginx

FROM nginx:1.23.0
COPY --from=node /app/dist/yakumo-dash /usr/share/nginx/html
