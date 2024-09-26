# BUILD

.EXPORT_ALL_VARIABLES:
ifeq ($(shell hostname), neo-yukkuricraft)
  export YAKUMO_HOST=yakumo.yukkuricraft.net
  export YAKUMO_PORT=80
  export IMAGE_NAME_SUFFIX=nginx-prod
else ifeq ($(shell hostname), cirno.localdomain)
  export YAKUMO_HOST=dev.yakumo.yukkuricraft.net
  export YAKUMO_PORT=25699
  export IMAGE_NAME_SUFFIX=dev
else
  export YAKUMO_HOST=yakumo.localhost
  export YAKUMO_PORT=25699
  export IMAGE_NAME_SUFFIX=local
endif

.PHONY: build
build: build_dev
build: build_local
build: build_nginx_dev
build: build_nginx_prod

.PHONY: build_dev
build_dev:
		docker build -f Dockerfile . \
		--target dev \
		--tag=yukkuricraft/yakumo-dash-dev

.PHONY: build_local
build_local:
		docker build -f Dockerfile . \
		--target local \
		--tag=yukkuricraft/yakumo-dash-local

.PHONY: build_nginx_dev
build_nginx_dev:
		docker build -f Dockerfile . \
		--target nginx_dev \
		--tag=yukkuricraft/yakumo-dash-nginx-dev

.PHONY: build_nginx_prod
build_nginx_prod:
		docker build -f Dockerfile . \
		--target nginx_prod \
		--tag=yukkuricraft/yakumo-dash-nginx-prod

# UP DOWN
DOCKER_COMPOSE_WITH_NGINX=docker-compose.yml
DOCKER_COMPOSE_NODE_ONLY=docker-compose.nodeonly.yml

.PHONY: up
up:
		docker compose -f $(DOCKER_COMPOSE_WITH_NGINX) up -d

.PHONY: down
down:
		docker compose -f $(DOCKER_COMPOSE_WITH_NGINX) down

.PHONY: up_node
up_node:
		docker compose -f $(DOCKER_COMPOSE_NODE_ONLY) up -d

.PHONY: down_node
down_node:
		docker compose -f $(DOCKER_COMPOSE_NODE_ONLY) down
