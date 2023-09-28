# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: fmauguin <fmauguin@student.42.fr >         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/11 21:40:38 by fmauguin          #+#    #+#              #
#    Updated: 2023/09/28 11:59:24 by fmauguin         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

SHELL				=	/bin/sh

COMPOSE				:= ./docker-compose.yml

all:
	docker compose -f $(COMPOSE) up -d

re: fclean all

down:
	docker compose -f $(COMPOSE) down

prune:
	docker system prune --force

fclean: stop down
	-docker rm -f $$(docker ps -a -q)
	-docker system prune --force --all

stop:
	-docker stop $$(docker ps -qa)

.PHONY: all re prune down stop fclean