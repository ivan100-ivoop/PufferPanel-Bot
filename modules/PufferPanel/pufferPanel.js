const { EmbedBuilder } = require('discord.js');
const ms = require('ms');
const axios = require('axios');

async function PingNode(host, port){
    return await axios.get(`https://${host}:${port}`).catch(err=> { return false; })
    return true;
}

async function getPanel(c, message, update){
    const { url, hostname } = c.framework.getConfig("panel");
    const color = c.framework.getColors();

    const isOnline = await c.pufferpanel.server.list().catch(e=> { return false; });

    let panelEmbed = new EmbedBuilder()
    .setTitle(message.panel)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.png`)
    .setURL(url)
    .setColor(color.info)
    .addFields([{
        "name": `Panel: ${hostname}`,
        "value": `Status: ${(isOnline ? message.online : message.offline)}`,
        "inline": true
    }])
    .setTimestamp()
    .setFooter({text: `updated ever ${ms(update)}`, icon: `https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.png` });
    return panelEmbed;
}

async function getNodes(c, message, nodesEmbed){
    const { status } = c.framework.getConfig("panel");
    const nodes_ = [];

    const nodes = await c.pufferpanel.node.list().catch(e=> { return false; });

    nodesEmbed.setTitle(message.nodes)
    .setTimestamp()

    if(!nodes) {
        nodesEmbed.setDescription("Found 0 Nodes!");
        return nodesEmbed;
    }

    for(let i = 0; i<nodes.length; i++){
        const node = nodes[i];
        if(status.prevent_local){
            if(!node.isLocal){
                const isOnline = await PingNode(node.publicHost, node.publicPort)
                nodes_.push({
                    "name": `Node: ${node.name}`,
                    "value": `Status: ${(isOnline ? message.online : message.offline)}`,
                    "inline": false
                });
            }
        } else {
            const isOnline = await PingNode(node.publicHost, node.publicPort)
            nodes_.push({
                "name": `Node: ${node.name}`,
                "value": `Status: ${(isOnline ? message.online : message.offline)}`,
                "inline": false
            });
        }
        
    }
    nodesEmbed.addFields(nodes_);

}

const UpdatePanel = async (client, data) => {
    let info;
    const log = client.framework.getLogger();
    const color = client.framework.getColors();
    const { url } = client.framework.getConfig("panel");
    const { messages, updateTime, channel_id, panel, nodes } = data;
    const channel = await client.channels.cache.get(channel_id)
    let message = await channel.messages.fetch({ limit: 1 }).then(msg => msg.filter(m => m.author.id === client.user.id).last())  
    
    if(panel){
        log.info("Enabled Panel Status.");
        info = await getPanel(client, messages, updateTime);
    } else {
        info = new EmbedBuilder()
        .setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`)
        .setURL(url)
        .setColor(color.info)
        .setFooter({text: `updated ever ${ms(updateTime)}`, icon: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png` });
    }

    if(nodes){
        log.info("Enabled Nodes Status.");
        await getNodes(client, messages, info);
    }
    
    if(!message){ 
        await channel.send({ embeds: [info]});
    } else { 
        await message.edit({ embeds: [info]}) 
    };
    
    setInterval(async () => {
        if(panel){
            info = await getPanel(client, messages, updateTime);
        }
    
        if(nodes){
            await getNodes(client, messages, info);
        }
        
        await message.edit({ embeds: [info]});
    }, updateTime)
}

module.exports = async (client) => {
        const log = client.framework.getLogger();
        if(client.pufferpanel){
            const { status } = client.framework.getConfig("panel");
            if(status.enabled){
                log.info("Starting Addon PufferPanel Status.");
                await UpdatePanel(client, status);
            }
        }
}