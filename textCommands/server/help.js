const Discord = require('discord.js');

module.exports = (client, message, args) => {
    const { textcommand_prefix } = client.framework.getConfig();
    message.channel.send({embeds:[
        new Discord.EmbedBuilder()
        .setTitle(`❓ | Need help?`)
        .setColor(Discord.Colors.Red)
        .setDescription(`\`${textcommand_prefix}server count\` - shows how many server slots you have and used\n\`${textcommand_prefix}server create\` - create a server\n\`${textcommand_prefix}server delete\` - delete a server\n\`${textcommand_prefix}server list\` - shows all your servers created\n\`${textcommand_prefix}server status\` - allows you to interact with the server\n\``)
    ]})
}