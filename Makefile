# BUILD

.PHONY: build
build: build_dev
build: build_nginx

.PHONY: build_dev
build_dev:
	docker build -f Dockerfile . \
	--target node \
	--tag=yukkuricraft/yakumo-dash-dev

.PHONY: build_nginx
build_nginx:
	docker build -f Dockerfile . \
	--tag=yukkuricraft/yakumo-dash-nginx

# UP DOWN

.PHONY: up
up:
	docker-compose -f docker-compose.yml up -d

.PHONY: down
down:
	docker-compose -f docker-compose.yml down
