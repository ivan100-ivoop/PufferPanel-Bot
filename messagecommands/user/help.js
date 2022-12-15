const { EmbedBuilder } = require('discord.js');
const { color, bot } = require('./../../config.json');

module.exports = (client, message, args) => {
    const commands = `${bot.prefix}user new\` - create an account\n\`${bot.prefix}user delete\` - unlink an account\n\`${bot.prefix}user password\` - reset your password\``;    
    message.channel.send({
        embeds:[
            new EmbedBuilder()
            .setTitle(`❓ | Need help?`)
            .setColor(color.warning)
            .setDescription(commands)    
        ]
    })
}