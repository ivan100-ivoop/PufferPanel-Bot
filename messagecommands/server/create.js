const Discord = require('discord.js');
const { bot, emoji, panel, nodes, hostname } = require('./../../config.json');
const User = require('../../modules/Users');

// panel API
const token = require('../../connect/token');
const ServerCreate = require('../../connect/server/create');


module.exports = async (client, message, args) => {
    const _token = await token();
    const userDB = await User.findOne({ id: message.author.id })
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${bot.prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);
    if(!args[1] || args[1]?.toLowerCase() === 'list'){  
        
        const panelButton = new Discord.ButtonBuilder()
        .setStyle('Link')
        .setURL(panel.url)
        .setLabel("Panel")
        
        const row = new Discord.ActionRowBuilder()
        .addComponents([panelButton])
        
        const noTypeListed = new Discord.EmbedBuilder() 
        .setColor(0x36393f)
        .setTitle('Types of servers you can create:')
        .addFields({ name: `${emoji} __**Discord Bots**__: `, value: ` NodeJS\nPython`, inline: true })
        .setFooter({ text: `Example: ${bot.prefix}server create nodejs testBot` })

        message.channel.send({
            content: `> :dart: What type of server you want me to create?`,
            embeds: [noTypeListed],
            components: [row]
        })
        return 
    }
    if(userDB.used >= userDB.left) return message.reply(`:x: You already used your all server slots. For more info run: ${bot.prefix}server count`)

    let ServerData; 
    try{
        ServerData = require(`./../../connect/eggs/${args[1]?.toLowerCase()}.js`)( (args[2] ? args[2] : args[1]), userDB.username, nodes[args[1]].node, nodes[args[1]].filename, hostname)
    }catch(err){
        console.log(err)
        message.reply(`:x: I could no find any server type with the name: \`${args[1]}\`\nType \`${bot.prefix}server create list\` for more info`)
        return
    }
    let msg = await message.reply(`:white_check_mark: Attemping to create you a server, please wait. . .`)
    const new_server = await ServerCreate(_token.token, _token.type, ServerData);
    if(new_server.id){
        console.log(`[${new Date().toLocaleString()}] [${message.guild.name}] [${message.author.tag}] Created server: ${ServerData.name}`)
        const serverButton = new Discord.ButtonBuilder()
        .setStyle('Link')
        .setURL(`${panel.url}/server/${new_server.id}`)
        if (ServerData.name.length < 25) {
            serverButton.setLabel(`[${ServerData.name}] Server Link`)
        } else {
            serverButton.setLabel(`Server Link`)
        }

        const row2 = new Discord.ActionRowBuilder()
        .addComponents([serverButton])
        userDB.servers.push(new_server.id);
        userDB.used = userDB.used + 1;
        await userDB.save();
        return msg.edit({
            content: null,
            embeds:[
                new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setTitle(`:clap: Server Created Successfully`)
                .setDescription(`
                > **User ID:** \`${userDB.panelID}\`
                > **Server ID:** \`${new_server.id}\`
                > **Server Name:** \`${(args[2] ? args[2] : args[1])}\`
                > **Server Type:** \`${args[1].toLowerCase()}\`
                `)
            ],
            components: [row2]
        })
            
    } else {
        msg.edit({
            content: null,
            embeds:[
                new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Red)
                .addField({ name: `:x: Server creation failed`, value: `The node had ran out of servers store!`})
            ]
        })
    }
    
}