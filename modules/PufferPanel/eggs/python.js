let user;
module.exports = ( name, username, node = 1, file = "bot.py", hostname = "SMPHost" ) => {
    if(Array.isArray(username)){
        user = username;
    } else {
        user = [username];
    }
    return {
      "name": name,
      "display": "discord.py Bot",
      "type": "discord",
      "install": [
        {
          "commands": [
            "python3 -m pip install -r ${req-txt-file}"
          ],
          "type": "command"
        }
      ],
      "run": {
        "stopCode": 2,
        "command": "python3 ${bot-py-file}",
        "workingDirectory": "",
        "pre": [],
        "post": [],
        "environmentVars": {}
      },
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
      "environment": {
        "image": "python",
        "type": "docker",
        "networkName": hostname
      },
      "supportedEnvironments": [
        {
          "image": "python",
          "type": "docker"
        }
      ],
      "requirements": {},
      "node": node,
      "user": user
    }
}