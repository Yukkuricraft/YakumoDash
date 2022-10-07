# BUILD

.PHONY: build
build: build_dev
build: build_nginx

.PHONY: build_dev
build_dev:
	docker build -f Dockerfile . \
	--target dev \
	--tag=yukkuricraft/yakumo-dash-dev

.PHONY: build_nginx
build_nginx:
	docker build -f Dockerfile . \
	--tag=yukkuricraft/yakumo-dash-nginx

# UP DOWN
DOCKER_COMPOSE_WITH_NGINX=docker-compose.yml
DOCKER_COMPOSE_NODE_ONLY=docker-compose.nodeonly.yml

.PHONY: up
up:
	docker-compose -f $(DOCKER_COMPOSE_WITH_NGINX) up -d

.PHONY: down
down:
	docker-compose -f $(DOCKER_COMPOSE_WITH_NGINX) down

.PHONY: up_node
up_node:
	docker-compose -f $(DOCKER_COMPOSE_NODE_ONLY) up -d

.PHONY: down_node
down_node:
	docker-compose -f $(DOCKER_COMPOSE_NODE_ONLY) down
