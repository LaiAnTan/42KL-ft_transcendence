build:
	docker-compose -f ./docker-compose.yml build
	docker-compose -f ./docker-compose.yml up

stop:
	docker-compose -f ./docker-compose.yml down

fclean:
	docker-compose -f ./docker-compose.yml down
	docker system prune -f
	docker volume prune -f

re:
	docker-compose -f ./docker-compose.yml down
	make fclean
	docker-compose -f ./docker-compose.yml build
	docker-compose -f ./docker-compose.yml up

ps:
	docker-compose -f ./srcs/docker-compose.yml ps

# docker system prune -a
# docker volume prune -f