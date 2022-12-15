const { EmbedBuilder } = require('discord.js');
const { color, bot } = require('./../config.json');

module.exports = (client, message, args) => {
    const commands = `${bot.prefix}user help\` - list with account commands \n\`${bot.prefix}server help\` - list with server commands \n\``;    
    message.channel.send({
        embeds:[
            new EmbedBuilder()
            .setTitle(`❓ | Need help?`)
            .setColor(color.warning)
            .setDescription(commands)    
        ]
    })
}