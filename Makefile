all: stop build

re: stop fclean build

build:
	docker-compose -f ./docker-compose.yml build
	docker-compose -f ./docker-compose.yml up

stop:
	docker-compose -f ./docker-compose.yml down

fclean:
	docker system prune -f
	docker volume prune -f



ps:
	docker-compose -f ./srcs/docker-compose.yml ps

# docker system prune -a
# docker volume prune -f