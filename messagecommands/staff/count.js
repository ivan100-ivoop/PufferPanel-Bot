const Discord = require('discord.js');
const { bot, staff } = require('./../../config.json');

const token = require('./../../connect/token')
const slist = require('./../../connect/server/list')
const ulist = require('./../../connect/user/list')

module.exports = async (client, message, args) => {
    const user = message.mentions.users.first() || message.author
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    const t = await token();
    const server = await slist(t.token, t.type);
    const users = await ulist(t.token, t.type);
    return message.channel.send({
        embeds:[
            new Discord.EmbedBuilder()
            .setTitle(`Panel Count`)
            .setColor(0x677bf9)
            .addFields({ name: 'Servers Count:', value: `\`\`\`\n${ server.length || 'no Servers'}\`\`\``, inline: true })
            .addFields({ name: 'Users Count:', value: `\`\`\`\n${ users.paging.total || 'no Users'}\`\`\``, inline: true })
        ]
    })
}