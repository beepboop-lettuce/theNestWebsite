## Setup Dev environment
### Install dependencies
GIN: a file watcher to hot reload the repo while you work  
`go get github.com/codegangsta/gin`  
### Configure environment variables
Add the following to ~/.bashrc:  
```shell
export ENV="development"
```
## Run Dev Server
cd into `theNestWebsite/` repo and run `make dev`  
This will start a server that can be visited @ `localhost:3000`

