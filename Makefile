DC_DEV = docker-compose --env-file .env.development.local -f docker-compose.dev.yml
DC_PROD = docker-compose --env-file .env.production.local -f docker-compose.prod.yml

.PHONY: dev prod stop-dev stop-prod clean

dev:
	$(DC_DEV) up --build -d

stop-dev:
	$(DC_DEV) stop

prod:
	$(DC_PROD) up --build -d

stop-prod:
	$(DC_PROD) stop

clean:
	$(DC_DEV) down -v --rmi all
	$(DC_PROD) down -v --rmi all

logs:
	$(DC_DEV) logs -f api
