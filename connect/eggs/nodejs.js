let user;
module.exports = ( name, username, node = 1, file = "bot.js", hostname = "SMPHost" ) => {
    if(Array.isArray(username)){
        user = username;
    } else {
        user = [username];
    }

    return {
        "data": {
          "bot-js-file": {
              "type": "string",
              "desc": "The main bot file.",
              "display": "Main bot file",
              "required": true,
              "value": file
          }
        },
        "display": "discord.js",
        "environment": {
          "image": "node",
          "networkMode": "host",
          "type": "docker",
          "networkName": hostname,
          "bindings": {}, 
          "portBindings": []
        },
        "install": [
          {
              "commands": [
                  "npm i"
              ],
              "type": "command"
          }
        ],
        "name": name,
        "node": node,
        "requirements": {
          "binaries": [
              "node",
              "npm"
          ]
        },
        "run": {
          "stop": "stop",
          "command": "node ./${bot-js-file}",
          "workingDirectory": "",
          "post": [],
          "pre": [],
          "stopCode": 0
        },
        "supportedEnvironments": [
          {
              "type": "standard"
          },
          {
              "image": "node",
              "networkMode": "host",
              "type": "docker"
          }
        ],
        "tasks": {},
        "type": "discord",
        "uninstall": [],
        "users": user
      };
};