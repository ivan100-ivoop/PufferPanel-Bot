# PufferPanel-Discord-Bot
Simple Discord Bot for puffer panel
## How to run 
`node . or pm2 start index.js`
## For Help
[Discord](https://discord.gg/ACprzbeMnM)
[Mail](mailto://admin@smphost.cf)
## How to Setup
`npm i or npm install`

`{
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
            "filename": "index.js",  // startup file
            "enabled": true // enable or disable deploy or this egg
        },
        "python": {
            "name": "Nodejs", //Display name on !server create
            "isPortForward": false, // is use port or not
            "node": 1, // deploy on node id
            "filename": "index.py", // startup file
            "enabled": true // enable or disable deploy or this egg
        },
        "paper": {
            "name": "Paper", //Display name on !server create
            "node": 1, // deploy on node id
            "isPortForward": true, // is use port or not
            "filename": "paper.jar",  // startup file
            "allocation": "ports.json", // ports filename locate in connect/eggs/ports.json
            "enabled": false // enable or disable deploy or this egg
        },
        "txt": "Nodes UpTime", // status title
        "update": 21600000 //status check time  6h
    },
    "bot": {
        "activity": "playing", // bot activity 
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
}`
# set ports to use all eggs Environment to docker not to Standard
`connect/eggs/ports.json in array`
`example [25565, 25567, 25568]`
