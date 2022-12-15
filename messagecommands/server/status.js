const pretty = require('prettysize');
const format = require('format-duration')
const Discord = require('discord.js')
const { bot, color, panel } = require('./../../config.json');
const User = require('../../modules/Users');

// panel API
const token = require('../../connect/token');
const ServerInfo = require('../../connect/server/info');
const command = {
    start: require('../../connect/server/start'),
    stop: require('../../connect/server/stop'),
    kill: require('../../connect/server/kill'),
    restart: require('../../connect/server/reload'),
}

function getColor(server){
    if(server.status === color.online){
        return Discord.Colors.Green;
    }
    if(server.status === color.offline){
        return Discord.Colors.Red;
    }
    return Discord.Colors.Yellow;
}

module.exports = async (client, message, args) => {
    const _token = await token();
    const userDB = await User.findOne({ id: message.author.id })
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${bot.prefix}user new\` to create one`)
    if (args[1].match(/[0-9a-z]+/i) == null) return message.channel.send("lol only use english characters.");
    if (!args[1]) return  await message.channel.send({embeds:[
        new Discord.EmbedBuilder()
            .setColor(color.success)
            .addField("__**Server Status**__", `What server should i display? \nCommand Format: \`${bot.prefix}server status <server id>\``)
        ]})
    if(!userDB.servers.includes(args[1])) return message.channel.send(`:x: You are not the owner of this server`)            
        message.channel.send('Checking server `' + args[1] + '`\nPlease wait, it wont take more that 10 seconds').then(async (msg) => {
                   const infoServer = await ServerInfo(_token.token, _token.type, args[1]);
                    let srvname = infoServer.name;
                    msg.edit({content: "<@" + message.author.id + ">", embeds:[
                            new Discord.EmbedBuilder()
                                .setColor(getColor(infoServer))
                                .setDescription(
                                    `**Status:** \`${infoServer.status}\`\n`
                                    + `**Name:** \`${srvname}\`\n`
                                    + `**Node:** \`${infoServer.node.name}\``
                                )
                                ], components:[
                                    new Discord.ActionRowBuilder()
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                                .setCustomId('start')
                                                .setLabel('🟢 Start')
                                                .setStyle('Success'),
                                        )
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                                .setCustomId('restart')
                                                .setLabel('🔄 Restart')
                                                .setStyle('Primary'),
                                        )
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('stop')
                                            .setLabel('🔴 Stop')
                                            .setStyle('Danger'),
                                        )
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('kill')
                                            .setLabel('⛔ Kill')
                                            .setStyle('Danger'),
                                        )
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                                .setLabel('🔗 Link')
                                                .setURL(`${panel.url}/server/${args[1]}`)
                                                .setStyle('Link'),
                                        )
                        ]})
                        const filter = m => m.user.id === message.author.id;
                        const collector = msg.createMessageComponentCollector({ filter, max: 1, time: 20000 }); 
                        collector.on('collect', async i => {
                            if(i.customId === "start"){
                                if(!await command.start(_token.token, _token.type, infoServer.id)){
                                    msg.edit({ content: `✅ | server \`${srvname}\` succssufuly started`, embeds:[], components:[]}).then(() => {
                                        setTimeout(() => {
                                            i.deleteReply()
                                        }, 5000)
                                    })
                                    collector.stop()
                                } else {
                                    msg.edit({embeds:[
                                        new Discord.EmbedBuilder()
                                                .setTitle(`:x: | Can't Start This Server`)
                                                .setColor(color.error)
                                        ], components:[]})
                                }
                            }
                            if(i.customId === "restart"){
                                if(!await command.restart(_token.token, _token.type, infoServer.id)){
                                    msg.edit({ content: `🔄 | server \`${srvname}\` succssufuly restarted`, embeds:[], components:[]}).then(() => {
                                        setTimeout(() => {
                                            i.deleteReply()
                                        }, 5000)
                                    })
                                    collector.stop()
                                } else {
                                    msg.edit({embeds:[
                                        new Discord.EmbedBuilder()
                                        .setTitle(`:x: | Can't Restart Server`)
                                        .setColor(color.error)
                                    ], components:[]})
                                }
                            }
                            if(i.customId === "stop"){
                                    if(!await command.stop(_token.token, _token.type, infoServer.id)){
                                        msg.edit({ content:`🔴 | server \`${srvname}\` succssufuly stopped`, embeds:[], components:[]}).then(() => {
                                            setTimeout(() => {
                                                i.deleteReply()
                                            }, 5000)
                                        })
                                        collector.stop()
                                    } else {
                                        msg.edit({embeds:[
                                            new Discord.EmbedBuilder()
                                            .setTitle(`:x: | Can't Stop Server`)
                                            .setColor(color.error)
                                        ], components:[]})
                                    }
                            }
                            if(i.customId === "kill"){
                                    if(!await command.kill(_token.token, _token.type, infoServer.id)){
                                        msg.edit({ content: `⛔ | server \`${srvname}\` succssufuly killed`, embeds:[], components:[]}).then(() => {
                                            setTimeout(() => {
                                                i.deleteReply()
                                            }, 5000)
                                        })
                                        collector.stop()
                                    } else {
                                        msg.edit({embeds:[
                                            new Discord.EmbedBuilder()
                                            .setTitle(`:x: | Can't Kill Server`)
                                            .setColor(color.error)
                                        ], components:[]})
                                    }
                            }
                        },2000)
                }).catch(err=> {
                    msg.edit(`:x: | ${err}`)
                })
}