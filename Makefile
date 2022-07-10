.PHONY: build
build:
	docker build -f Dockerfile . \
	--tag=yukkuricraft/yakumo-dash

