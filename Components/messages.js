const { bot, errors } = require('../config.json');
const { Events } = require('discord.js');
const { join } = require('path');
const { existsSync } = require('fs');

module.exports = async (client) =>{
    client.on(Events.MessageCreate, async message => {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content.startsWith(bot.prefix)) return;
        const args = message.content.slice(bot.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length === 0) return;
        if(cmd === "help") return require(`./../${join(bot.txt, 'help.js')}`)(client, message);
        const root = join(join('../', bot.txt), cmd);
        if(!existsSync(join(__dirname, root))) return require(`./${join(root, 'help.js')}`)(client, message);
        const _command = join(root, `${args[0]}.js`);
        if(!existsSync(join(__dirname, _command))) return require(`./${join(root, 'help.js')}`)(client, message, args);
        if (_command === null) return message.channel.send(errors["not_found"]);
        return require(`./${_command}`)(client, message, args);
      });
};