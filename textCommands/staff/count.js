const Discord = require('discord.js');

module.exports = async (client, message, args) => {
    
    const staff = client.framework.getConfig("staff");

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const user = message.mentions.users.first() || message.author
    
    if(!staff.admin.includes(user.id) && !staff.owners.includes(user.id)) return message.reply(`:x: You dont have permission to use this command!`)

    const server = await client.pufferpanel.server.list();
    const users = await client.pufferpanel.user.list();

    return message.channel.send({
        embeds:[
            new Discord.EmbedBuilder()
            .setTitle(`Panel Count`)
            .setColor(0x677bf9)
            .addFields({ name: 'Servers Count:', value: `\`\`\`\n${ server.servers.length || 'no Servers'}\`\`\``, inline: true })
            .addFields({ name: 'Users Count:', value: `\`\`\`\n${ users.users.length || 'no Users'}\`\`\``, inline: true })
        ]
    })
}