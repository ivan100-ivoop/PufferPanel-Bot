# PufferPanel-Discord-Bot
Simple Discord Bot for puffer panel
# is comming update with staff commands
## How to Setup
`js`{
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
            "node": 1, // deploy on node id
            "filename": "index.js"
        },
        "python": {
            "node": 1,
            "filename": "index.py"
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
        "not_found": "Hmmm I can't find This Command!!"
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
}``
