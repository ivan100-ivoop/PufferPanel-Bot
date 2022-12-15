const { color, bot } = require('./../../config.json');
const Discord = require('discord.js');

module.exports = (client, message, args) => {
    message.channel.send({embeds:[
        new Discord.EmbedBuilder()
        .setTitle(`❓ | Need help?`)
        .setColor(Discord.Colors.Red)
        .setDescription(`\`${bot.prefix}server count\` - shows how many server slots you have and used\n\`${bot.prefix}server create\` - create a server\n\`${bot.prefix}server delete\` - delete a server\n\`${bot.prefix}server list\` - shows all your servers created\n\`${bot.prefix}server status\` - allows you to interact with the server\n\``)
    ]})
}