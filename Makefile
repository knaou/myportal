FRONTEND_IMAGE_NAME := knaou/myportal-frontend:latest
BACKEND_IMAGE_NAME := knaou/myportal-backend:latest

.PHONY: image-build
image-build: image-build-frontend image-build-backend

.PHONY: image-build-frontend
image-build-frontend:
	docker build --pull -t ${FRONTEND_IMAGE_NAME} --network host -f Dockerfile.client .

.PHONY: image-build-backend
image-build-backend:
	docker build --pull -t ${BACKEND_IMAGE_NAME} --network host -f Dockerfile.server .

.PHONY: image-push
image-push: image-build
	docker push ${FRONTEND_IMAGE_NAME}
	docker push ${BACKEND_IMAGE_NAME}

.PHONY: dev-api
dev-api:
	pipenv run dev

.PHONY: dev-vue
dev-vue:
	cd client && yarn run watch
