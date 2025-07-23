FRONTEND_DIR=frontend
BACKEND_DIR=backend
BACKEND_BUILD_DIR=$(BACKEND_DIR)/dist
BACKEND_ENTRY=$(BACKEND_BUILD_DIR)/index.js

env:
	cp .env-example .env
	cp .env $(FRONTEND_DIR)/.env
	cp .env $(BACKEND_DIR)/.env

frontend:
	cd $(FRONTEND_DIR) && npm run dev &

backend:
	cd $(BACKEND_DIR) && npm run build && node dist/server.js

test-backend:
	cd ${BACKEND_DIR} && npm test

dev: env
	make frontend
	make backend

.PHONY: env frontend backend dev