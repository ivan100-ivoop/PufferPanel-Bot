const Discord = require('discord.js')

module.exports = async (client, message, args) => {
    let response = "", servers = new Discord.EmbedBuilder()
        .setTitle(`Servers live status`)
        .setColor(Discord.Colors.Green);

    const staff = client.framework.getConfig("staff");

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const user = message.mentions.users.first() || message.author

    if(!staff.admin.includes(user.id) && !staff.owners.includes(user.id)) return message.reply(`:x: You dont have permission to use this command!`)

    if(staff.owners.includes(user.id)) return message.reply(`:x: Owner servers can't be Listed`)

    message.channel.send({ content: '🔄 Collecting Servers Live Status Wait...'}).then(async (msg) => {
        const listing = await client.pufferpanel.server.list();

        if(listing){

            if(listing.servers.length < 0) {
                return msg.edit({
                    content: '', 
                    embeds:[
                        new Discord.EmbedBuilder()
                        .setTitle(`Servers live status`)
                        .setColor(0x677bf9)
                        .setDescription(`**Servers** have \`0\`servers`)
                    ]
                })
            }

            for(let i = 0; i<listing.servers.length; i++){
                const s = listing.servers[i];
                const status = await client.pufferpanel.server.getStatus(s.id).catch(e=> { return "offline" });
                response +=  `${s.name} - ${status}\n`;
                
            }

            servers.addFields({ name: 'All Servers:', value: `\`\`\`\n${response}\`\`\``, inline: true })
            
            return msg.edit({content: '', embeds:[servers] })
        } else {
            return msg.edit(`:x: Error i can't find nothing!!`);
        }
    }).catch(err=> {
        message.channel.send(`:x: | ${err}`)
    })
}