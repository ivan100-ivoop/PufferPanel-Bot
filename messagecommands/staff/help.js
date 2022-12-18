const { EmbedBuilder } = require('discord.js');
const { color, bot, staff } = require('./../../config.json');

module.exports = (client, message, args) => {
    const user = message.mentions.users.first() || message.author
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    const commands = `${bot.prefix}staff count\` - list of servers and users \n\`${bot.prefix}staff delete <id>\` - unlink user server \n\`${bot.prefix}staff list <user>\` - list user and servers \n\`${bot.prefix}staff status <id>\` - interact with user servers \n\`${bot.prefix}staff unlink <user>\` - unlink user Account \n\``;    
    message.channel.send({
        embeds:[
            new EmbedBuilder()
            .setTitle(`❓ | Need help?`)
            .setColor(color.warning)
            .setDescription(commands)    
        ]
    })
}
