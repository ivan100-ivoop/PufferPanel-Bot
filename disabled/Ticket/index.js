const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const getPanel = (client) => {
    let panel = { embeds:[], components:[] };
    const config = client.framework.getConfig("mainPanel");
    const colors = client.framework.getColors();
    const settings = config.embed;

    const embed = new EmbedBuilder()
    .setTitle(settings.title)
    .setDescription(settings.message);

    if(settings.thumbnail){
        const image = (settings.thumbnail == "" ? `https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.png` : settings.thumbnail);
        embed.setThumbnail(image);
    }

    if(settings.url && settings.url != ""){
        embed.setURL(settings.url);
    }

    if(settings.color && settings.color != ""){
        if(settings.color.includes("#")){
            embed.setColor(settings.color);
        } else {
            embed.setColor((colors[settings.color] ? colors[settings.color] : colors.default));
        }
    }

    if(settings.timestamp){
        embed.setTimestamp();
    }

    if(settings.footer.enabled && settings.footer.text && settings.footer.text != ""){
        const image = (settings.footer.thumbnail == "" ? `https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.png` : settings.footer.thumbnail);
        embed.setFooter({text: settings.footer.text, icon: image});
    }

    panel.embeds.push(embed);
    panel.components.push(new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel((config.buttons.open.title ? config.buttons.open.title : "Open Ticket"))
        .setStyle((config.buttons.open.style ? config.buttons.open.style : "Success"))
    ));
    

    return panel;
}

module.exports = {
    run: async (client) => {
        const settings = client.framework.getConfig("mainPanel");
        const logger = client.framework.getLogger();

        if(!settings.enabled) return;

        logger.info("Starting Addon Tickets.");

        const channel = await client.channels.cache.get(settings.channel_id);
        let messages = await channel.messages.fetch({ limit: 10 }).then(msg => msg.filter(m => m.author.id === client.user.id).last())
        const panel = getPanel(client);

        if(!messages) return await channel.send(panel);
        
        return await messages.edit(panel);
    }
}