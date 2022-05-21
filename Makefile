.PHONY: build
build:
	go build -o ./bin

# gin defaults the app port to 3000
.PHONY: dev
dev: build
	gin run -i -all go run ./bin
