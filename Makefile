.PHONY: build
build:
	go build -o ./bin

# gin defaults the app port to 3000
.PHONY: dev-gin
dev-gin: build
	gin run -i -all go run ./bin

.PHONY: dev
dev: build
	exec ./bin/theNestWebsite
