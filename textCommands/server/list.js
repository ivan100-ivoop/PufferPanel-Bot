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
    const { textcommand_prefix } = client.framework.getConfig();
    const user = message.mentions.users.first() || message.author;
    let embed;

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const userDB = await User.findOne({ id: user.id })
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);
    
    if(userDB.servers.length > 0){

        embed = new Discord.EmbedBuilder()
            .setTitle(`${user.username} server's`)
            .setColor(Discord.Colors.Green);

        await ServerCount(embed, userDB, client.pufferpanel.server);
        
    } else {

        embed = new Discord.EmbedBuilder()
            .setTitle(`${user.username} server's`)
            .setColor(0x677bf9)
            .setDescription(`**${user.username}** have \`${userDB.used}\` server's`);

    }

    return message.reply({embeds:[embed] });
}