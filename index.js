const client = require('./Components/client');
const mongodb = require('./Components/mongodb');
const { bot, statusNodes } = require('./config.json');

async function init(){
    if(await mongodb()){
        client.login(bot.token);
    }
}

init();