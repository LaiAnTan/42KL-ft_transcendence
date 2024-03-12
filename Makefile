C_CYAN = \033[0;96m
C_GREEN = \033[0;92m
C_RESET = \033[0m

DOCKER_COMPOSE := ./docker-compose.yml

all: down up

build:
	@echo "$(C_CYAN)Building images...$(C_RESET)"

	docker compose -f $(DOCKER_COMPOSE) build

	@echo "$(C_GREEN)Done!$(C_RESET)"

up: build
	@echo "$(C_CYAN)Starting containers...$(C_RESET)"

	docker compose -f $(DOCKER_COMPOSE) up

	@echo "$(C_GREEN)Done!$(C_RESET)"

down:
	docker compose -f $(DOCKER_COMPOSE) down

ps:
	docker ps

clean:
	docker system prune -f

fclean:
	@echo "$(C_CYAN)Stopping and deleting containers...$(C_RESET)"

	@-docker stop $(shell docker ps -qa) 2>/dev/null || true
	@-docker rm $(shell docker ps -qa) 2>/dev/null || true

	@echo "$(C_CYAN)Deleting images...$(C_RESET)"
	@-docker rmi $(shell docker images -qa) 2>/dev/null || true

	@echo "$(C_CYAN)Deleting volumes...$(C_RESET)"
	@-docker volume rm $(shell docker volume ls -q) 2>/dev/null || true

	@echo "$(C_RESET)$(C_CYAN)Deleting networks...$(C_RESET)"
	@-docker network rm $(shell docker network ls -q) 2>/dev/null || true

	@echo "$(C_RESET)$(C_GREEN)Done!$(C_RESET)\n"

postgres:
	docker-compose -f ./docker-compose.yml exec postgres /bin/bash

django:
	docker-compose -f ./docker-compose.yml exec django /bin/bash

javascript:
	docker-compose -f ./docker-compose.yml exec javascript /bin/bash

re: down fclean up
