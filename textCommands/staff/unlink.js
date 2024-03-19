const Discord = require('discord.js');
const User = require('./../../modules/db/Users');

module.exports = async (client, message, args) => {
    const staff = client.framework.getConfig("staff");

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );
    
    const user = message.author;
    const pinuser = message.mentions.users.first();
    
    if(!staff.admin.includes(user.id) && !staff.owners.includes(user.id)) return message.reply(`:x: You dont have permission to use this command!`)
    
    if(!pinuser) return message.reply(`:x: Please include user to unlink`)

    if(staff.owners.includes(pinuser.id)) return message.reply(`:x: Owner servers can't be Listed`)

    const userDB = await User.findOne({ id: pinuser.id })
    if(!userDB) return message.reply(`:x: I dont find this account`);

    const listing = await client.pufferpanel.server.list();

    let msg = await message.reply({content: `You are going to delete account with username: \`${userDB.username}\`. Once you click the yes button all your ${userDB.servers.length > 1 ? '\`'+ userDB.servers.length + '\` servers' : 'servers'} will be deleted.\n\n⚠️ *This acction is not reversable. once you deleted this account all data will be lost forever*`, components:[
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
            msg.edit({content: '', embeds:[
                new Discord.EmbedBuilder()
                .setTitle(':x: Account Deletion canceled')
                .setColor(Discord.Colors.Red)
            ], components: []})
            return
        }
        if(reason === 'DeleteTheAccount'){
            if(userDB.servers.length > 0){
                await msg.edit('Deleting servers...')
                
                //TODO: restore allocation in file for used node

                for(let i =0; i< userDB.servers.length; i++){
                    const server = userDB.servers[i];
                    let info = listing.servers.find(s=> s.id === server) || {};

                    const _delete = await client.pufferpanel.server.delete(server).catch(e=> { return false; });
                    
                    if(!_delete){
                        msg.edit(`:x: Error i can't delete server ${info.name} - ${info.id}!!`);
                    }
                }
            }

            await msg.edit({content: 'Deleting account . . .', components: []})
            
            const remove = await client.pufferpanel.user.delete(userDB.panelID);
            
            if(remove){
                await User.deleteOne({ id: message.author.id });
                msg.edit({content: 'Account Deleted', components: []})
            } else {
                msg.edit({content: 'There was an error deleting your account', components: []})
            }
            
            msg.edit({content: 'Account Deleted', components: []})
        }
    })
}