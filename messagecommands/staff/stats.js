const pretty = require('prettysize');
const format = require('format-duration')
const Discord = require('discord.js')
const { bot, color, panel, staff } = require('./../../config.json');
const User = require('../../modules/Users');

// panel API
const token = require('../../connect/token');
const servers = require('../../connect/server/list');

module.exports = async (client, message, args) => {
    const user = message.mentions.users.first() || message.author
    if(!staff.admin.includes(user.id) && staff.owner != user.id) return message.reply(`:x: You dont have permission to use this command!`)
    if(staff.owner != user.id) return message.reply(`:x: Owner servers can't be Listed`)
    message.channel.send({ content: '🔄 Collecting Servers Live Status Wait...'}).then(async (msg) => {
        const t = await token();
        const s = await servers(t.token, t.type);
        if(s){
            let servers = new Discord.EmbedBuilder()
            .setTitle(`Servers live status`)
            .setColor(Discord.Colors.Green)
            .addFields({ name: 'All Servers:', value: `\`\`\`\n${s.map(x => `${x.name} - ${x.status}`).join('\n')  || 'no Servers'}\`\`\``, inline: true })
            return msg.edit({content: '', embeds:[servers] })
        } else {
            return msg.edit({
                content: '', 
                embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle(`Servers live status`)
                    .setColor(0x677bf9)
                    .setDescription(`**Servers** have \`0\`servers`)
                ]
            })
        }
    }).catch(err=> {
        message.channel.send(`:x: | ${err}`)
    })
}
