const Discord = require('discord.js');

module.exports = async (client, message, args) => {
    const staff = client.framework.getConfig("staff");
    const color = client.framework.getColors();
    const { textcommand_prefix } = client.framework.getConfig();

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );
    
    const user = message.mentions.users.first() || message.author
    if(!staff.admin.includes(user.id) && !staff.owners.includes(user.id)) return message.reply(`:x: You dont have permission to use this command!`)
    
    const commands = `${textcommand_prefix}staff count\` - list of servers and users \n\`${textcommand_prefix}staff delete <id>\` - unlink user server \n\`${textcommand_prefix}staff list <user>\` - list user and servers \n\`${textcommand_prefix}staff status <id>\` - interact with user servers \n\`${textcommand_prefix}staff unlink <user>\` - unlink user Account \n\`${textcommand_prefix}staff stats\` -Live status form all servers \n\``;    
    
    message.channel.send({
        embeds:[
            new Discord.EmbedBuilder()
            .setTitle(`❓ | Need help?`)
            .setColor(color.warning)
            .setDescription(commands)    
        ]
    })
}