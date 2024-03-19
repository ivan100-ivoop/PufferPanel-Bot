const { EmbedBuilder } = require('discord.js');

module.exports = (client, message, args) => {
    const colors = client.framework.getColors();

    message.channel.send({
        embeds:[
            new EmbedBuilder()
            .setTitle(`❓ | Need help?`)
            .setColor(colors.warning)
            .setDescription("Ok")    
        ]
    })
}