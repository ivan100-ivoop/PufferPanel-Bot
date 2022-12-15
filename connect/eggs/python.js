let user;
module.exports = ( name, username, node = 1, file = "bot.py", hostname = "SMPHost" ) => {
    if(Array.isArray(username)){
        user = username;
    } else {
        user = [username];
    }
    return {
        "data": {
          "bot-py-file": {
              "type": "string",
              "desc": "The main bot file.",
              "display": "Main bot file",
              "required": true,
              "value": file
          },
          "req-txt-file": {
              "type": "string",
              "desc": "The file used to install the python libs.",
              "display": "Requirements txt file",
              "required": true,
              "value": "requirements.txt"
          }
        },
        "display": "discord.py",
        "environment": {
          "image": "python",
          "networkMode": "host",
          "type": "docker",
          "networkName": hostname,
          "bindings": {}, 
          "portBindings": []
        },
        "install": [
          {
              "commands": [
                  "python3 -m pip install -r ${req-txt-file}"
              ],
              "type": "command"
          }
        ],
        "name": name,
        "node": node,
        "requirements": {
          "binaries": [
              "python3"
          ]
        },
        "run": {
          "stop": "stop",
          "command": "python3 ${bot-py-file}",
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
              "image": "python",
              "networkMode": "host",
              "type": "docker"
          }
        ],
        "tasks": {},
        "type": "discord",
        "uninstall": [],
        "users": user
      }
};