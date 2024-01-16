# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: fmauguin <fmauguin@student.42.fr >         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/11 21:40:38 by fmauguin          #+#    #+#              #
#    Updated: 2024/01/16 16:07:15 by fmauguin         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

SHELL				=	/bin/sh

COMPOSE				:= ./docker-compose.yml

#vol_db=postgresql
front=Pong/backend
back=Pong/frontend

#mkdir -p ${vol_db}

all:
	docker compose -f $(COMPOSE) up -d

re: fclean all

softre: clean all

down:
	docker compose -f $(COMPOSE) down

prune:
	docker system prune --force

clean: stop down
	-docker rm -f $$(docker ps -a -q)
	-docker volume rm $$(docker volume ls -q)
	-docker volume prune --force
	-docker network prune --force

fclean: clean
	-docker system prune --force --all
	-rm -rf ${vol_db} front/node_modules back/node_modules
stop:
	-docker stop $$(docker ps -qa)

.PHONY: all re prune down stop fclean
