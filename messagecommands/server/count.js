const Discord = require('discord.js');
const { bot } = require('./../../config.json');
const User = require('../../modules/Users');

module.exports = async (client, message, args) => {
    const user = message.mentions.users.first() || message.author
    const userDB = await User.findOne({ id: message.author.id });
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${bot.prefix}user new\` to create one`)

    return message.channel.send({
        embeds:[
            new Discord.EmbedBuilder()
            .setTitle(`${user.username}'s Server Count`)
            .setColor(0x677bf9)
            .setDescription(`**${user.username}** have used \`${userDB.used}/${userDB.max}\` servers`)
        ]
    })
}