const Discord = require('discord.js');
const User = require('./../../modules/db/Users');

module.exports = async (client, message, args) => {
    const { textcommand_prefix } = client.framework.getConfig();
    const user = message.mentions.users.first() || message.author

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const userDB = await User.findOne({ id: message.author.id });
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);
    return message.channel.send({
        embeds:[
            new Discord.EmbedBuilder()
            .setTitle(`${user.username} Server's Count`)
            .setColor(0x677bf9)
            .setDescription(`**${user.username}** have used \`${userDB.used}/${userDB.max}\` servers`)
        ]
    })
}