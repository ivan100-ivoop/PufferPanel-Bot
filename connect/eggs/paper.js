let user;
module.exports = ( name, username, node = 1, file = "paper.jar", hostname = "SMPHost" ) => {
    if(Array.isArray(username)){
        user = username;
    } else {
        user = [username];
    }

    return {
        "name": name,
        "display":"Paper - Minecraft",
        "type":"minecraft-java",
        "install":[
            {
                "files": [
                    "https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${build}/downloads/paper-${version}-${build}.jar"
                ],
                "type": "download"
            },{
                "source":"paper-*.jar",
                "target": file,
                "type":"move"
            },{
                "target":"server.properties",
                "text":"server-ip=${ip}\nserver-port=${port}\nmotd=${motd}\n",
                "type":"writefile"
            },{
                "target":"eula.txt",
                "text":"eula=${eula}",
                "type":"writefile"
            }
        ],
        "run": {
            "stop":"stop",
            "command":"${java} -Xmx${memory}M -Dterminal.jline=false -Dterminal.ansi=true -Djline.terminal=jline.UnsupportedTerminal -Dlog4j2.formatMsgNoLookups=true -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar paper.jar nogui",
            "workingDirectory":"",
            "pre":[],
            "post":[],
            "environmentVars":{}
        },
        "data":{
            "build":{
                "type":"string",
                "desc":"Build of Paper to install (<a href='https://papermc.io/downloads'>Paper version build</a>). Must be specified as a build number, e.g. 484",
                "display":"build",
                "required":true,
                "value":"302"
            },
            "eula":{
                "type":"boolean",
                "desc":"Do you agree to the Minecraft EULA?","display":"EULA Agreement (true/false)",
                "required":true,"value":true},"ip":{"type":"string","desc":"What IP to bind the server to","display":"IP","required":true,"value":"0.0.0.0"},"java":{"type":"string","desc":"\"java\" for system standard, else direct path to java","display":"path to java executable","required":true,"value":"java","userEdit":true},
                "memory":{
                    "type":"integer",
                    "desc":"How much memory in MB to allocate to the Java Heap",
                    "display":"Memory (MB)",
                    "required":true,
                    "value":1024
                },
                "motd":{
                    "type":"string",
                    "desc":"This is the message that is displayed in the server list of the client, below the name. The MOTD does support <a href='https://minecraft.gamepedia.com/Formatting_codes' target='_blank'>color and formatting codes</a>.",
                    "display":"MOTD message of the day",
                    "required":true,
                    "value":"A Minecraft Server\\n\\u00A79 hosted on PufferPanel"
                },
                "port":{
                    "type":"integer",
                    "desc":"What port to bind the server to",
                    "display":"Port",
                    "required":true,
                    "value":25565
                },
                "version":{
                    "type":"string",
                    "desc":"Version of Minecraft to install (<a href='https://papermc.io/downloads'>Paper maintained versions</a>). Must be specified as a release number, e.g. 1.16.5",
                    "display":"Version",
                    "required":true,
                    "value":"1.19.2"
                }
            },
            "environment":{
                "image":"openjdk:17",
                "type":"docker",
                "networkMode":"host",
                "networkName": hostname,
                "portBindings":[
                    "0.0.0.0:25569:25565/tcp"
                ]
            },
            "supportedEnvironments":[
                {
                    "type":"standard"
                },
                {
                    "image":"openjdk:16",
                    "type":"docker"
                }
            ],
            "requirements":{
                "binaries":[
                    "${java}"
                ]
            },
            "node": node,
            "users": user
        };
}