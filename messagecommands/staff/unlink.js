const Discord = require('discord.js');
const { bot, staff } = require('./../../config.json');
const User = require('../../modules/Users');

// panel api
const token = require('./../../connect/token');
const RemoveUser = require('./../../connect/user/delete');

module.exports = async (client, message, args) => {
    const user = message.author;
    const pinuser = message.mentions.users.first();
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    if(!pinuser) return message.reply(`:x: Please include user to unlink`)
    if(staff.owner == pinuser.id) return message.reply(`:no_pedestrians: Owner can't be unlink`)
    const _token = await token();
    const userDB = await User.findOne({ id: pinuser.id })
    if(!userDB) return message.reply(`:x: I dont find this account`);
    let msg = await message.reply({content: `You are going to delete account with username: \`${userDB.username}\`. Once you click the yes button all your ${userDB.servers.length > 1 ? '\`'+ userDB.servers.length + '\` servers' : 'servers'} will be deleted.\n\n⚠️ *This acction is not reversable. once you deleted your account all your data will be lost forever*`, components:[
        new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('DeleteTheAccount')
                .setLabel('Yes')
                .setStyle('Success'),
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('CancelAccountDeletion')
                .setLabel('No')
                .setStyle('Danger'),
        )
    ]}
    )

    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async i => {
        i.deferUpdate()
        if(i.customId === "DeleteTheAccount") return collector.stop('DeleteTheAccount')
        if(i.customId === "CancelAccountDeletion") return collector.stop('CancelAccountDeletion')
    })

    collector.on('end', async(a, reason) => {

        msg.edit({
            components:[
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('DeleteTheAccount')
                        .setLabel('Yes')
                        .setStyle('Success')
                        .setDisabled(true)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('CancelAccountDeletion')
                        .setLabel('No')
                        .setStyle('Danger')
                        .setDisabled(true)
                )
            ]
        })


        if(reason === 'time'){
            msg.edit({
                components:[
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('DeleteTheAccount')
                            .setLabel('Yes')
                            .setStyle('Success')
                            .setDisabled(true)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('CancelAccountDeletion')
                            .setLabel('No')
                            .setStyle('Danger')
                            .setDisabled(true)
                    )
                ]
            })
            return
        }
        if(reason === 'CancelAccountDeletion'){
            msg.edit({embeds:[
                new Discord.EmbedBuilder()
                .setTitle(':x: Account Deletion canceled')
                .setColor(Discord.Colors.Red)
            ], components: []})
            return
        }
        if(reason === 'DeleteTheAccount'){
            if(userDB.servers.length > 0){
                await msg.edit('Deleting servers...')
                //remove servers
                for(let i =0; i< userDB.servers.length; i++){
                    const server = userDB.servers[i];
                    await RemoveServer(_token.token, _token.type, server.id);
                }
            }

            await msg.edit({content: 'Deleting account . . .', components: []})
            const usr = await RemoveUser(_token.token, _type.type, userDB.panelID);
            if(usr){
                msg.edit({content: `:x: I can't Find this account in panel database but i continue to remove it from interact database!`, components: []})
            }
            userDB.delete();
            msg.edit({content: 'Account Deleted', components: []})
        }
    })
}
