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

## Network + Security Config
### System.d article
https://www.atpeaz.com/running-go-app-as-a-service-on-ubuntu/

### Config ssl certs
https://help.zerossl.com/hc/en-us/articles/360060120373-Installing-SSL-Certificate-on-Ubuntu

### Port forwarding
```shell 
    sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
    sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
```
The app will force redirect all http traffic to https
