const { bot, panel, color, nodes, statusNodes } = require('../config.json');
const token = require('../connect/token');
const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

async function getNodes(c){
    const _token = await token();
    const _nodes = await require('../connect/node/list')(_token.token, _token.type);
    let exampleEmbed = new EmbedBuilder()
    .setTitle(nodes.txt)
    .setDescription(`Nodes Status [Total: ${_nodes.count}]`)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.png`)
    .setURL(panel.url)
    .setColor(color.info)
    .setTimestamp()
    .setFooter({text: `updated ever ${ms(nodes.update)}`, icon: `https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.png` });
    let nodes_ = [];
    for(let i = 0; i<_nodes.nodes.length; i++){
        const node = _nodes.nodes[i];
        nodes_.push({
            "name": `Node: ${node.name}`,
            "value": `Status: ${node.status}`,
            "inline": true
          });
    }
    exampleEmbed.addFields(nodes_);
    return exampleEmbed;
}

async function statusInfo(client){
    if(statusNodes){
        const channel = await client.channels.cache.get(bot.status)
        let messages = await channel.messages.fetch({ limit: 10 }).then(msg => msg.filter(m => m.author.id === client.user.id).last())
        let info = await getNodes(client);
        await messages.edit({ embeds: [info]});
        setInterval(async () => {
            info = await getNodes(client);
            await messages.edit({ embeds: [info]});
        }, nodes.update)
    }
}

module.exports = statusInfo;