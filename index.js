const Framework = require('./framework');

const configFolder = "config";

const loader = new Framework()
    .setConfig(require(`./${configFolder}/config.json`)) //configuration from config.json
    .setColors(require(`./${configFolder}/colors.json`))  //colors json file can be use from any where with client.framework.getColors()
    .setErrors(require(`./${configFolder}/errors.json`)) //errors json file can be use from any where with client.framework.getErrors()
    .setConfigFolder(configFolder) // config folder for client.framework.getConfig(<name>)
    .registerSlashCommandsFolder("./commands") // /command folder
    .registerTextCommandsFolder("./textCommands") // !commands folder
    .registerHandlers("./handlers") //handles folder
    .setSaveLog("./log");  //save log folder

loader.addHandler(require('./modules/PufferPanel'));
loader.boot();