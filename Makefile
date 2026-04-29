DC_DEV = docker-compose --env-file .env.development.local -f docker-compose.dev.yml
DC_PROD = docker-compose --env-file .env.production.local -f docker-compose.prod.yml

.PHONY: dev prod stop-dev stop-prod clean

dev:
	$(DC_DEV) up --build -d

stop-dev:
	$(DC_DEV) stop

down-dev:
	$(DC_DEV) down

prod:
	$(DC_PROD) up --build -d

stop-prod:
	$(DC_PROD) stop

down-prod:
	$(DC_PROD) down

clean:
	$(DC_DEV) down -v --rmi all
	$(DC_PROD) down -v --rmi all

mig-gen:
	docker exec -it north-shop-api npm run typeorm -- migration:generate src/migrations/$(name) -d src/config/data-source.ts

mig-run:
	docker exec -it north-shop-api npm run migration:run

mig-revert:
	docker exec -it north-shop-api npm run typeorm -- migration:revert -d src/config/data-source.ts

logs:
	$(DC_DEV) logs -f api
