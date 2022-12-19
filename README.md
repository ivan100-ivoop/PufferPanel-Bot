
# PufferPanel-Bot

Simple Discord Bot for puffer panel

All eggs Environment is in docker not to Standard
## Deployment

|      info         |         command         |
| ------------------|-------------------------|
|    install pkg    |       npm install       |
|        run        |      node index.js      |
| run in background |   pm2 start index.js    |

## ports.json

if isPortForward is enable it is auto get port or on delete server is auto insert back port to ports.json

```json
[25565, 25567, 25568]
```
## config.json
```json
{
    "mongodb": "<You mongo db connect url>",
    "emoji": ":point_right:",
    "hostname": "host name of panel ",
    "statusNodes": true, // show live status of node or nodes in pufferpannel
    "max": 3, // max server to create per user
    "staff": {
        "owner": "", // owner id from discord
        "admin": [] // ids of admins
    },
    "nodes": { // allow ro create server a put nodejs and python 
        "nodejs": {
            "name": "Nodejs", //Display name on !server create
            "isPortForward": false, // is use port or not
            "node": 1, // deploy on node id
            "category": "Discord Bot",// Category of server
            "filename": "index.js",  // startup file
            "enabled": true // enable or disable deploy or this egg
        },
        "python": {
            "name": "Nodejs", //Display name on !server create
            "isPortForward": false, // is use port or not
            "node": 1, // deploy on node id
            "category": "Discord Bot",// Category of server
            "filename": "index.py", // startup file
            "enabled": true // enable or disable deploy or this egg
        },
        "paper": {
            "name": "Paper", //Display name on !server create
            "node": 1, // deploy on node id
            "isPortForward": true, // is use port or not
            "category": "Minecraft Server", // Category of server
            "filename": "paper.jar",  // startup file
            "allocation": "ports.json", // ports filename locate in connect/eggs/ports.json
            "enabled": false // enable or disable deploy or this egg
        },
        "txt": "Nodes UpTime", // status title
        "update": 21600000 //status check time  6h
    },
    "bot": {
        "activity": "playing", // bot activity: playing, listening, competing, empty for watching
        "id": "", // bot client_id
        "token": "", // bit token
        "guild": "", // server id in discord
        "createAccount": "", // category id for create acc
        "legal": "", // terms, legal (channel id)
        "status": "", // status channel id
        "dir": "splashcommand", // folder
        "txt": "messagecommands", // folder
        "prefix": "!" // prefix !user 
    },
    "error": {
        "not_found": "Hmmm I can't find This Command!!",
        "allocations": "All Allocation is in use!"
    },
    "panel": {
        "url": "", // panel url 
        "client_id": "", // * admin client_id
        "client_secret": "" // *admin client_secret
    },
    "color": {
        "error": "#ff3333",
        "warning": "#ff9933",
        "info": "#99ff33",
        "success": "#66ff33",
        "default": "#33ff33",
        "online": "🟢 UP",
        "offline": "🔴 DOWN",
        "undefined": "❓ Unknown"
    }
}
```
```bash
node verison 18.12.1
npm version 9.1.2
```

## Links

Free [MogoDB](https://cloud.mongodb.com/)

Install [PufferPanel](https://docs.pufferpanel.com/en/2.x/installing.html)

Proxy PufferPanel [Nginx](https://docs.pufferpanel.com/en/2.x/guides/nginx.html)

Proxy PufferPanel [Apache](https://docs.pufferpanel.com/en/2.x/guides/apache.html)

Proxy PufferPanel [Caddy](https://docs.pufferpanel.com/en/2.x/guides/caddy.html)

Use Docker on [PufferPanel](https://docs.pufferpanel.com/en/2.x/docker.html)

## Screenshots

![staff help](https://raw.githubusercontent.com/ivan100-ivoop/PufferPanel-Bot/main/images/image%20(1).png)

![help](https://raw.githubusercontent.com/ivan100-ivoop/PufferPanel-Bot/main/images/image%20(3).png)

![user help](https://raw.githubusercontent.com/ivan100-ivoop/PufferPanel-Bot/main/images/image%20(4).png)

![server help](https://raw.githubusercontent.com/ivan100-ivoop/PufferPanel-Bot/main/images/image%20(5).png)

![nodes status](https://raw.githubusercontent.com/ivan100-ivoop/PufferPanel-Bot/main/images/image%20(2).png)
