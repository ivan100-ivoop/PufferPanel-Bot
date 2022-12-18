const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { color, hostname } = require('./../../config.json');

module.exports = async (client, message, args)=>{
    const link = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('🔗 Github')
            .setURL('https://github.com/ivan100-ivoop/PufferPanel-Bot')
            .setStyle('Link')
    );

    message.channel.send({ embeds: [
        new EmbedBuilder()
            .setTitle("About Me")
            .setColor(color.info)
            .setURL('https://github.com/ivan100-ivoop/PufferPanel-Bot')
            .setDescription(`Oh Thanks for ask\n I'm Hosted on ${hostname} but i'm Created from vanko#8243\nIf you wont me on you host(panel) you can simple click button and flow steps!`)
            .setTimestamp()
    ], components: [link]});
};
