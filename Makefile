.PHONY: help build run stop clean dev test

# Variables
IMAGE_NAME = birthday-party-landing
CONTAINER_NAME = birthday-party-app
PORT = 3000

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) .

run: ## Run container
	@echo "Starting container..."
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):3000 \
		-v $$(pwd)/uploads:/app/uploads \
		$(IMAGE_NAME)
	@echo "Container started! Visit http://localhost:$(PORT)"

stop: ## Stop container
	@echo "Stopping container..."
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

restart: stop run ## Restart container

clean: stop ## Clean up containers and images
	@echo "Cleaning up..."
	docker rmi $(IMAGE_NAME) || true
	docker system prune -f

dev: ## Run in development mode (with nodemon)
	@echo "Starting development server..."
	npm install
	npm run dev

logs: ## Show container logs
	docker logs -f $(CONTAINER_NAME)

shell: ## Open shell in running container
	docker exec -it $(CONTAINER_NAME) sh

test: ## Run tests (if any)
	@echo "No tests configured yet"

install: ## Install dependencies
	npm install

.DEFAULT_GOAL := help
