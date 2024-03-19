const Discord = require('discord.js');
const User = require('./../../modules/db/Users');

function getList(t, client){
    const { textcommand_prefix } = client.getConfig();
    const nodes = client.getConfig("types");
    let response = [];
    let test = null;
    let keys = Object.keys(nodes);

    for(let i=0; i<keys.length; i++){
        if(nodes[keys[i]].enabled){
            if(nodes[keys[i]].name){
                if(!test){
                    test = nodes[keys[i]].name;
                }
                if(response[nodes[keys[i]].category]){
                    response[nodes[keys[i]].category] += `${nodes[keys[i]].name}\n`;
                } else {
                    response[nodes[keys[i]].category] = `${nodes[keys[i]].name}\n`;
                }
            }
        }
    }
    if(response.length >= 0){
        let key = Object.keys(response);
        for(let i=0; i<key.length; i++){
            const out = response[key[i]];
            t.addFields({ name: `:point_right: __**${key[i]}**__: `, value: `${out}`, inline: true });
        }
        t.setFooter({ text: `Example: ${textcommand_prefix}server create ${test.toLowerCase()} test` });
    }
    return t;
}

module.exports = async (client, message, args) => {
    let ServerData; 
    const { textcommand_prefix } = client.framework.getConfig();
    const { url, hostname } = client.framework.getConfig("panel");
    const nodes = client.framework.getConfig("types");

    const user = message.mentions.users.first() || message.author

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const userDB = await User.findOne({ id: user.id })
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);

    if(!args[1] || args[1]?.toLowerCase() === 'list'){  
        const panelButton = new Discord.ButtonBuilder()
        .setStyle('Link')
        .setURL(url)
        .setLabel("Panel")
        
        const row = new Discord.ActionRowBuilder()
        .addComponents([panelButton])
        let  noTypeListed = new Discord.EmbedBuilder() 
        .setColor(0x36393f)
        .setTitle('Types of servers you can create:');
        noTypeListed = getList(noTypeListed, client.framework);

        message.channel.send({
            content: `> :dart: What type of server you want me to create?`,
            embeds: [noTypeListed],
            components: [row]
        })
        return 
    }

    if(userDB.used >= userDB.max) return message.reply(`:x: You already used your all server slots. For more info run: ${textcommand_prefix}server count`)

    try{
        if(!nodes[args[1].toLowerCase()].enabled) return message.reply(`:x: I could no find any server type with the name: \`${args[1].toLowerCase()}\`\nType \`${textcommand_prefix}server create list\` for more info`)
        
        if(nodes[args[1].toLowerCase()].isPortForward){
            let port = 25566
          // let port = require('./../../connect/eggs/port')(nodes[args[1].toLowerCase()].allocation);
           // if(!port) return message.reply(`:x: ${error.allocations}`)
            ServerData = require(`./../../modules/PufferPanel/eggs/${args[1].toLowerCase()}.js`)( (args[2] ? args[2] : args[1].toLowerCase()), userDB.username, nodes[args[1].toLowerCase()].node, nodes[args[1].toLowerCase()].filename, hostname, port);
        } else {
            ServerData = require(`./../../modules/PufferPanel/eggs/${args[1]?.toLowerCase()}.js`)( (args[2] ? args[2] : args[1]?.toLowerCase()), userDB.username, nodes[args[1]?.toLowerCase()].node, nodes[args[1]?.toLowerCase()].filename, hostname);
        }

    }catch(err){
        console.log(err)
        message.reply(`:x: I could no find any server type with the name: \`${args[1]}\`\nType \`${textcommand_prefix}server create list\` for more info`)
        return
    }

    let msg = await message.reply(`:white_check_mark: Attemping to create you a server, please wait. . .`)
    const new_server = await client.pufferpanel.server.create(ServerData).catch(e=> { return false;});

    if(!new_server){
        return msg.edit({
            content: null,
            embeds:[
                new Discord.EmbedBuilder()
                .setTitle(`:x: Server creation failed.`)
                .setDescription(`The node had ran out of servers store!`)
                .setColor(Discord.Colors.Red)
            ]
        })
    }
    
    const serverButton = new Discord.ButtonBuilder()
        .setStyle('Link')
        .setURL(`${url}/server/${new_server}`)
    if (ServerData.name.length < 25) {
        serverButton.setLabel(`[${ServerData.name}] Server Link`)
    } else {
        serverButton.setLabel(`Server Link`)
    }
    
    const row2 = new Discord.ActionRowBuilder()
    .addComponents([serverButton]);

    userDB.servers.push(new_server);
    userDB.used = userDB.used + 1;
    await userDB.save();

    const userPanel = {
        email: userDB.email,
        editServerData: true,
        editServerUsers: true,
        installServer: true,
        putServerFiles: true,
        sendServerConsole: true,
        serverIdentifier: new_server,
        sftpServer: true,
        startServer: true,
        stopServer: true,
        viewServerConsole: true,
        viewServerFiles: true,
        viewServerStats: true,
        viewServers: true,
    };

    await client.pufferpanel.server.updateUser(new_server, userPanel).catch(e=>{})
    return msg.edit({
        content: null,
        embeds:[
            new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle(`:clap: Server Created Successfully`)
            .setDescription(`
            > **User ID:** \`${userDB.panelID}\`
            > **Server ID:** \`${new_server}\`
            > **Server Name:** \`${(args[2] ? args[2] : args[1])}\`
            > **Server Type:** \`${args[1].toLowerCase()}\`
            `)
        ],
        components: [row2]
    })

}