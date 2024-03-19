const { EmbedBuilder } = require('discord.js');

module.exports = (client, message, args) => {
    const { textcommand_prefix } = client.framework.getConfig();
    const color = client.framework.getColors();
    const commands = `${textcommand_prefix}user new\` - create an account\n\`${textcommand_prefix}user delete\` - unlink an account\n\`${textcommand_prefix}user password\` - reset your password\``;    
    message.channel.send({
        embeds:[
            new EmbedBuilder()
            .setTitle(`❓ | Need help?`)
            .setColor(color.warning)
            .setDescription(commands)    
        ]
    })
}