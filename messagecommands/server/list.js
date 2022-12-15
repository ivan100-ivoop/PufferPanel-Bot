const Discord = require('discord.js');
const { bot } = require('./../../config.json');
const User = require('../../modules/Users');

// panel API
const token = require('../../connect/token');
const ServerInfo = require('../../connect/server/info');

async function ServerCount(o, s, t){
    let id = 0, id2 = 0;
    let array = [];
    o.addFields({ name: 'Server Id:', value: `\`\`\`\n${s.map(x => `${id++}. ${x}`).join('\n') || 'no Servers'}\`\`\``, inline: true})
    for(let i = 0; i<s.length; i++){
        const server = await ServerInfo(t.token, t.type, s[i]);
        if(server){
            array.push(server.name);
        }
    }
    o.addFields({ name: 'Server Name:', value: `\`\`\`\n${array.map(x => `${id2++}. ${x}`).join('\n')  || 'no Servers'}\`\`\``, inline: true })
}

module.exports = async (client, message, args) => {
    const _token = await token();
    const userDB = await User.findOne({ id: message.author.id })
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${bot.prefix}user new\` to create one`)
    if(userDB.servers.length > 0){
        let servers = new Discord.EmbedBuilder()
        .setTitle(`${message.author.username}'s servers`)
        .setColor(Discord.Colors.Green)
        await ServerCount(servers, userDB.servers, _token);
        return message.reply({embeds:[servers] });
    } else {
        const user = message.mentions.users.first() || message.author
        return message.channel.send({
            embeds:[
                new Discord.EmbedBuilder()
                .setTitle(`${user.username}'s servers`)
                .setColor(0x677bf9)
                .setDescription(`**${user.username}** have \`${userDB.used}\`servers`)
            ]
        })
    }
}