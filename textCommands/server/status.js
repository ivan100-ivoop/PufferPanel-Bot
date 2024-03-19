const Discord = require('discord.js')

const User = require('./../../modules/db/Users');

function getStatusColor(status){
    if(status === "online"){
        return Discord.Colors.Green;
    }
    if(status === "offline"){
        return Discord.Colors.Red;
    }
    return Discord.Colors.Yellow;
}

module.exports = async (client, message, args) => {
    const { textcommand_prefix } = client.framework.getConfig();
    const { url } = client.framework.getConfig("panel");
    const color = client.framework.getColors();

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );
    
    const userDB = await User.findOne({ id: message.author.id })
    
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);

    if (args.length <= 1) return message.channel.send(":x: server id is required!");
    
    if (args[1].match(/[0-9a-z]+/i) == null) return message.channel.send(":x: lol only use english characters.");
    
    if (!args[1]) return  await message.channel.send({embeds:[
        new Discord.EmbedBuilder()
            .setColor(color.success)
            .addField("__**Server Status**__", `What server should i display? \nCommand Format: \`${textcommand_prefix}server status <server id>\``)
        ]})

    if(userDB.servers.length < 1) return message.channel.send(`:x: You are not have created server's!`)
        
    if(!userDB.servers.includes(args[1])) return message.channel.send(`:x: You are not the owner of this server`) 
        
    message.channel.send('Checking server `' + args[1] + '`\nPlease wait, it wont take more that 10 seconds').then(async (msg) => {
        const listing = await client.pufferpanel.server.list();
        const server = listing.servers.find(s=> s.id === args[1])

        if(!server) return msg.edit(":x: Error missing in panel!")

        const status = await client.pufferpanel.server.getStatus(server.id).catch(e=> { return "offline" });
        
        msg.edit({content: "<@" + message.author.id + ">", embeds:[
            new Discord.EmbedBuilder()
                .setColor(getStatusColor(status))
                .setDescription(
                    `**Status:** \`${status.toUpperCase()}\`\n`
                    + `**Name:** \`${server.name}\`\n`
                    + `**Node:** \`${server.node.name}\``
                )
                ], components:[
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('start')
                                .setLabel('🟢 Start')
                                .setStyle('Success'),
                            new Discord.ButtonBuilder()
                                .setCustomId('restart')
                                .setLabel('🔄 Restart')
                                .setStyle('Primary'),
                            new Discord.ButtonBuilder()
                            .setCustomId('stop')
                            .setLabel('🔴 Stop')
                            .setStyle('Danger'),
                            new Discord.ButtonBuilder()
                            .setCustomId('kill')
                            .setLabel('⛔ Kill')
                            .setStyle('Danger')
                        ),
                        new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('reinstall')
                            .setLabel('🗑️ ReInstall')
                            .setStyle('Danger'),
                            new Discord.ButtonBuilder()
                                .setLabel('🔗 Link')
                                .setURL(`${url}/server/${args[1]}`)
                                .setStyle('Link')
                        )
        ]})
        
        const filter = m => m.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, max: 1, time: 20000 }); 
        
        collector.on('collect', async i => {
            
            msg.edit({ content: `Please wait, it wont take more that 10 seconds`, embeds:[], components:[]});

            if(i.customId === "start"){
                if(!await client.pufferpanel.server.start(server.id, true).catch(e=> { return false; })){
                    msg.edit({ content: `✅ | server \`${server.name}\` succssufuly started`, embeds:[], components:[]});
                    collector.stop()
                } else {
                    msg.edit({embeds:[
                        new Discord.EmbedBuilder()
                                .setTitle(`:x: | Can't Start This Server`)
                                .setColor(color.error)
                        ], components:[]})
                }
            }

            if(i.customId === "reinstall"){
                if(!await client.pufferpanel.server.install(server.id, true).catch(e=> { return false; })){
                    msg.edit({ content: `✅ | server \`${server.name}\` succssufuly reinstall`, embeds:[], components:[]});
                    collector.stop()
                } else {
                    msg.edit({content: "", embeds:[
                        new Discord.EmbedBuilder()
                                .setTitle(`:x: | Can't ReInstall This Server`)
                                .setColor(color.error)
                        ], components:[]})
                }
            }

            if(i.customId === "restart"){
                if(!await client.pufferpanel.server.reload(server.id, true).catch(e=> { return false; })){
                    msg.edit({ content: `🔄 | server \`${server.name}\` succssufuly restarted`, embeds:[], components:[]});
                    collector.stop()
                } else {
                    msg.edit({content: "", embeds:[
                        new Discord.EmbedBuilder()
                        .setTitle(`:x: | Can't Restart Server`)
                        .setColor(color.error)
                    ], components:[]})
                }
            }

            if(i.customId === "stop"){
                if(!await client.pufferpanel.server.stop(server.id, true).catch(e=> { return false; })){
                    msg.edit({ content:`🔴 | server \`${server.name}\` succssufuly stopped`, embeds:[], components:[]});
                    collector.stop()
                } else {
                    msg.edit({content: "", embeds:[
                        new Discord.EmbedBuilder()
                        .setTitle(`:x: | Can't Stop Server`)
                        .setColor(color.error)
                    ], components:[]})
                }
            }

            if(i.customId === "kill"){
                if(!await client.pufferpanel.server.kill(server.id, true).catch(e=> { return false; })){
                    msg.edit({ content: `⛔ | server \`${server.name}\` succssufuly killed`, embeds:[], components:[]});
                    collector.stop()
                } else {
                    msg.edit({content: "", embeds:[
                        new Discord.EmbedBuilder()
                        .setTitle(`:x: | Can't Kill Server`)
                        .setColor(color.error)
                    ], components:[]})
                }
            }

        }, 2000);
    }).catch(err=> {
        msg.edit(`:x: | ${err}`)
    })
}