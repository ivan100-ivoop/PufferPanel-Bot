const Discord = require('discord.js');
const User = require('./../../modules/db/Users');

async function ServerCount(embed, userDB, connection){
    let id = 0, id2 = 0;
    let array = [];
    const listing = await connection.list();

    embed.addFields({ name: 'Server Id:', value: `\`\`\`\n${userDB.servers.map(x => `${id++}. ${x}`).join('\n') || 'no Servers'}\`\`\``, inline: true})
    
    for(let i = 0; i<userDB.servers.length; i++){
        const server = listing.servers.find(s=> s.id === userDB.servers[i]);
        if(server){
            array.push(server.name);
        }
    }
    embed.addFields({ name: 'Server Name:', value: `\`\`\`\n${array.map(x => `${id2++}. ${x}`).join('\n')  || 'no Servers'}\`\`\``, inline: true })
}

module.exports = async (client, message, args) => {
    const staff = client.framework.getConfig("staff");

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const user = message.author;
    const pinuser = message.mentions.users.first();

    if(!staff.admin.includes(user.id) && !staff.owners.includes(user.id)) return message.reply(`:x: You dont have permission to use this command!`)
    
    if(!pinuser) return message.reply(`:x: Please include user to get info`)

    if(staff.owners.includes(pinuser.id)) return message.reply(`:x: Owner servers can't be Listed`)

    const userDB = await User.findOne({ id: ( !pinuser ? user.id : pinuser.id) })
    if(!userDB) return message.reply(`:x: I dont find this account`)

    if(userDB.servers.length > 0){
        let servers = new Discord.EmbedBuilder()
        .setTitle(`${userDB.username} server's`)
        .setColor(Discord.Colors.Green);

        await ServerCount(servers, userDB, client.pufferpanel.server);

        return message.channel.send({ embeds:[servers] });
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