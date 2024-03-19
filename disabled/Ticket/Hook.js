const { EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, Events } = require('discord.js');

const fixUser = (message, userId) => {
    return message.replace("{name}", `<@${userId}>`);
}

const fixChannel = (message, tiketId) => {
    return message.replace("{ticket}", `<#${tiketId}>`);
}

const fixRoles = (message, support) => {
    let tag = ""; 

    for (const role of support.roles){
        tag += `<@&${role}>`;
    }

    for (const user of support.users){
        tag += `<@${user}>`;
    }

    return message.replace("{tag}", tag);
}

const createdMessage = (client, user, channel) => {
    const settings = client.framework.getConfig("created");

    const embed = new EmbedBuilder()
    .setTitle(fixChannel(fixUser(settings.title, user.id), channel.id))
    .setDescription(fixChannel(fixUser(settings.message, user.id), channel.id));

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
        embed.setFooter({text: fixUser(settings.footer.text, user.id), icon: image});
    }

    return embed;
}

const createChannels = async (interaction, client) => {
    const settings = client.framework.getConfig("created");

    let channel_settings = {
        name: settings.channel_title.replace("{name}", interaction.user.username),
        type: ChannelType.GuildText,
        parent: settings.category_id,
        permissionOverwrites: [
            {
                type: "member",
                id: interaction.user.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel, 
                    PermissionsBitField.Flags.SendMessages, 
                    PermissionsBitField.Flags.ReadMessageHistory
                ],
            },
            {
                type: "member",
                id: client.user.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.ManageMessages,
                ],
            },
            {
                type: 'role', 
                id: interaction.guild.roles.everyone.id, 
                deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ]
            }
        ]
    };

    for (const role of settings.roles){
        channel_settings.permissionOverwrites.push({
            type: 'role', 
            id: role,
            allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.ManageMessages,
            ],
        });
    }

    return await interaction.guild.channels.create(channel_settings);
}

const createPanelClose = (client, user) => {
    const settings = client.framework.getConfig("closeTicket");

    const embed = new EmbedBuilder()
    .setTitle(fixRoles(fixUser(settings.title, user.id), settings.support))
    .setDescription(fixRoles(fixUser(settings.message, user.id), settings.support));

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
        embed.setFooter({text: fixUser(settings.footer.text, user.id), icon: image});
    }

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel((settings.buttons.close.title ? settings.buttons.close.title : "Close Ticket"))
        .setStyle((settings.buttons.close.style ? settings.buttons.close.style : "Success"))
    );

    return { embeds:[embed], components: [buttons] };
}

const removeContainer = (client) => {
    const settings = client.framework.getConfig("closeTicket");

    const embed = new EmbedBuilder()
    .setTitle(settings.close.title)
    .setDescription(settings.close.message);

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('remove_confirm')
        .setLabel((settings.buttons.confirm.title ? settings.buttons.confirm.title : "Confirm"))
        .setStyle((settings.buttons.confirm.style ? settings.buttons.confirm.style : "Success")),
        new ButtonBuilder()
        .setCustomId('clear_embed')
        .setLabel((settings.buttons.cancel.title ? settings.buttons.cancel.title : "Cancel"))
        .setStyle((settings.buttons.cancel.style ? settings.buttons.cancel.style : "Danger"))
    );
    return { embeds:[embed], components: [buttons] };
}

module.exports = {
    run: async (client) => {
        const settings = client.framework.getConfig("mainPanel");
        const logger = client.framework.getLogger();

        if(!settings.enabled) return;

        logger.info("Starting Addon Ticket Hook.");

        client.once(Events.InteractionCreate, async (interaction) => {

            if (!interaction.isButton()) return;

            const { user, customId } = interaction;

            if(customId === "open_ticket"){

                const channel = await createChannels(interaction, client);
                const replay = createdMessage(client, user, channel);
                channel.send(createPanelClose(client, user));
            
                return await interaction.reply({ embeds: [replay], ephemeral:true });
            } else if(customId === "remove_confirm") {
                setTimeout(async ()=>{
                    interaction.channel.delete();
                }, 5000);

                return await interaction.reply({ content:settings.removeMessage });
            } else if(customId === "clear_embed") {
                let messages = await interaction.channel.messages.fetch({ limit: 1 }).then(msg => msg.filter(m => m.author.id === client.user.id).last());
                if(messages){
                    messages.delete();
                }
                return;
            } else if(customId === "close_ticket"){
                return await interaction.reply(removeContainer(client));
            }

        });

    }
}