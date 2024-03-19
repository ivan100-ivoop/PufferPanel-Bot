const Discord = require('discord.js');
const User = require('./../../modules/db/Users');

function rebuild(s, id){
    const _new = [];
    for(let i = 0; i<s.length; i++){
        if(s[i] !== id){
            _new.push(s[i]);
        }
    }
    return _new;
}

module.exports = async (client, message, args) => {
    const { textcommand_prefix } = client.framework.getConfig();
    const user = message.mentions.users.first() || message.author

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const userDB = await User.findOne({ id: user.id })
    
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);

    if(args.length <= 1) return message.channel.send(":x: server id is required!");
    if(!args[1]) return message.reply(`:x: What server should i delete? please provide you server id *(${textcommand_prefix}server delete <server id>)*`)
    if(args[1].match(/[0-9a-z]+/i) == null) return message.channel.send("lol only use english characters.");
    
    if(!userDB.servers.includes(args[1])) return message.channel.send(`:x: You are not the owner of this server`) 

    let msg = await message.channel.send('Let me check if this is your server, please wait . . .')
    const listing = await client.pufferpanel.server.list();
    const server = listing.servers.find(s=> s.id === args[1]);

    if(!server) return msg.edit(`:x: I could not find that server`)
    msg.edit({
        content: `Are you sure you want to delete \`${server.name}\`? once you delete your server you will never be able to recover it and all data and files will be lost forever!`,
        components:[
            new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('AcceptDelete')
                    .setLabel('Yes')
                    .setStyle('Success'),
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('RejectDelete')
                    .setLabel('No')
                    .setStyle('Danger'),
            )
        ]
    });

    const filter = i => i.user.id === user.id;
    const Collector = msg.createMessageComponentCollector({ filter, time: 300000 });

    Collector.on('collect', async i => {
        i.deferUpdate()
        Collector.stop()

        if(i.customId === "AcceptDelete") {
            msg.edit({
                content: `Deleting Server \n Please wait . . .`,
            })
            let port = server.port || null;
            let type = server.type || null;

            const _delete = await client.pufferpanel.server.delete(server.id).catch(e=> { return false; });
            if(!_delete){
                return msg.edit(`:x: Error i can't delete this server!!`);
            }
            
            //TODO: restore allocation in file for used node
                
            msg.edit(`:white_check_mark: Server deleted!`)
            
            if(!userDB.used) return msg.edit('WTF? how did u got a server?')
            
            userDB.used = userDB.used - 1;
            userDB.servers = rebuild(userDB.servers, server.id);
            await userDB.save();
            
        }

        if(i.customId === "RejectDelete") {
            msg.edit({
                content: `${success} Server deletion canceled`,
            })
        }
    });

    Collector.on('end',() => {
        msg.edit({components:[]})
    });
}
