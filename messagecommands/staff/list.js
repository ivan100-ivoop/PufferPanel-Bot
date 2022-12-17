const Discord = require('discord.js');
const { bot, staff } = require('./../../config.json');

const token = require('../../connect/token');
const ServerInfo = require('../../connect/server/info');
const User = require('../../modules/Users');

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
    const user = message.author;
    const pinuser = message.mentions.users.first();
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    const _token = await token();
    const userDB = await User.findOne({ id: ( !pinuser ? user.id : pinuser.id) })
    if(!userDB) return message.reply(`:x: I dont find this account`)
    if(staff.owner == userDB.id && staff.owner != user.id) return message.reply(`:x: Owner servers can't be Listed`)
    if(userDB.servers.length > 0){
        let servers = new Discord.EmbedBuilder()
        .setTitle(`${userDB.username}'s servers`)
        .setColor(Discord.Colors.Green)
        await ServerCount(servers, userDB.servers, _token);
        return message.reply({embeds:[servers] });
    } else {
        return message.channel.send({
            embeds:[
                new Discord.EmbedBuilder()
                .setTitle(`${userDB.username}'s servers`)
                .setColor(0x677bf9)
                .setDescription(`**${userDB.username}** have \`${userDB.used}\`servers`)
            ]
        })
    }

}