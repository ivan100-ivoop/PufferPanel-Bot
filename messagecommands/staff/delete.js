const Discord = require('discord.js');
const { bot, emoji, panel, nodes, hostname, staff } = require('./../../config.json');
const User = require('../../modules/Users');

// panel API
const token = require('../../connect/token');
const ServerRemove = require('../../connect/server/delete');
const ServerInfo = require('../../connect/server/info');

function rebuild(s, id){
    const _new = [];
    for(let i = 0; i<s.length; i++){
        if(s[i] !== id){
            _new.push(s[i]);
        }
    }
    return _new;
}

async function findUser(id){
    const users = await User.find({});
    for(let i = 0; i < users.length; i++){
        if(users[i].servers.includes(id)){
            return users[i];
        }
    }
    return null;
}

function findNode(t){
    let keys = Object.keys(nodes);
    for(let i=0; i<keys.length; i++){
        if(nodes[keys[i]].enabled){
            const node = require(`./../../connect/eggs/${keys[i]?.toLowerCase()}.js`)('test', 'test', 0);
            if(node.type === t){
               return nodes[keys[i]];
            }
        }
    }
    return null;
}


module.exports = async (client, message, args) => {
    const _token = await token();
    const user = message.mentions.users.first() || message.author
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    if (args[1].match(/[0-9a-z]+/i) == null) return message.channel.send("lol only use english characters.");
    let msg = await message.channel.send('Let me check if this is your server, please wait . . .')
    const output = await ServerInfo(_token.token, _token.type, args[1]);
    if(!output) return msg.edit(`:x: I could not find that server`)
    const userDB = await findUser(output.id);
    if(!userDB) msg.edit(`:x: I could not find that user but i continue to delete server!`)
    if(staff.owner == userDB.id && staff.owner != user.id) return message.reply(`:x: Owner servers can't be Deleted`)
    msg.edit({
            content: `Are you sure you want to delete \`${output.name}\`? once you delete your server you will never be able to recover it and all data and files will be lost forever!`,
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
        })

        const filter = i => i.user.id === message.author.id;
        const Collector = msg.createMessageComponentCollector({ filter, time: 300000 });

        Collector.on('collect', async i => {
            i.deferUpdate()
            Collector.stop()
            if(i.customId === "AcceptDelete") {
                msg.edit({
                    content: `Deleting Server \n Please wait . . .`,
                })
                let port = output.port || null;
                let type = output.type || null;
                const _delete = await ServerRemove(_token.token, _token.type, output.id);
                if(!_delete){
                    if(port && type){
                        let n = findNode(type);
                        if(n){
                            require('./../../connect/eggs/port')(n.allocation, port);
                        }
                    }
                    msg.edit(`:white_check_mark: Server deleted!`)
                    if(userDB){
                        if(!userDB.used) return msg.edit('WTF? how did him got a server?')
                        userDB.used = userDB.used - 1;
                        userDB.servers = rebuild(userDB.servers, output.id);
                        await userDB.save();
                    }
                } else {
                    msg.edit(`:x: Error i can't delete this server!!`);
                }
            }
            if(i.customId === "RejectDelete") {
                msg.edit({
                    content: `${success} Server deletion canceled`,
                })
            }
        })

        Collector.on('end',() => {
            msg.edit({components:[]})
        })
}
