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
# The OS will route all traffic to 443 to 8443 and
# all traffic from 8443 out to 443
```shell 
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443

sudo iptables -t nat -A OUTPUT -p tcp --dport 443 -o lo -j REDIRECT --to-port 8443```
```
