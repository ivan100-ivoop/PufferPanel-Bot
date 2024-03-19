
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

if isPortForward is enable it is auto get port or on delete server is auto insert back port to ports.json (not ready)

```json
[25565, 25567, 25568]
```
## /config/config.json
```json
{
	"save_log": false, //auto create and save console log in log folder
	"textcommand_prefix": "!", //textcommands prefix default !.
	"bot": {
		"token": "", //bot token
		"application_id": "", //bot id
		"activity": { //activity: playing, listening, competing, empty for watching.
			"enabled": true,
			"type": "playing",
			"message": "Games" //message in activity.
		}
	},
	"guilds": [], //server's ID
	"tag_on_error": {
		"enabled": false, /
		"log_channel": [] // chanel to be tag if have some errors!
	}
}
```

## /config/mongo/MongoConnect.json
```json
{
   "url": "", //mongo db connect url
}
```

## /config/PufferPanel/panel.json
```json
{
    "normal": false,// auth type off require client_id and client_secret or on require email and password.
    "url": "", //panel url.
    "client_id": "", // * admin client_id.
    "client_secret": "", // *admin client_secret.
    "email": "", // *admin email.
    "password": "", // *admin password.
    "hostname": "SMPHosting", //host name of panel. 
    "status": {
        "enabled": true, //show live status of nodes or panel.
        "panel": false, //enable panel.
        "nodes": true, //enable nodes.
        "updateTime": 30000, //status check time 30s.
        "prevent_local": true, //bypass local nodes.
        "channel_id": "", //status channel id.
        "messages": {
            "panel": "Panel UpTime", //status panel title
            "nodes": "UpTime", //status node title
            "online": "🟢 UP",
            "offline": "🔴 DOWN",
            "undefined": "❓ Unknown"
        }
    },
    "settings": {
        "createAccount": "", //category id for create acc.
        "legal": "", //terms, legal (channel id).
        "welcome_message": "👋 Welcome to SMP Hosting",
        "change_password": "New password for SMP Hosting",
        "max_servers": 1 //max server to create per user.
    }
}
```

## /config/PufferPanel/staff.json
```json
{
    "admin": [], //staff id
    "owners": [] //owner's id
}
``` 

## /config/PufferPanel/types.json
```json
{
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
}
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
