const Discord = require('discord.js');
const User = require('./../../modules/Users');
const { bot } = require('./../../config.json');

// panel api
const token = require('./../../connect/token');
const UpdateUser = require('./../../connect/user/update');


module.exports = async (client, message, args) => {
    const userDB = await User.findOne({ id: message.author.id });
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${bot.prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);
    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var getPassword = () => {
        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    let password = await getPassword();
    const _token = await token();
        const data = {
            id: userDB.panelID,
            email: userDB.email,
            username: userDB.username,
            newpassword: password
        }
    const update = await UpdateUser(_token.token, _token.type, data);
    if(!update){
            client.users.cache.get(message.author.id).send({embeds:[
                new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Blue)
                .addFields({ name: 'Reset Password', value: `New password for SMP Hosting: ||**${data.newpassword}**||` })
                .setFooter({text:`This message will autodestruct in 10 minutes`})
            ]}).then(x => {
                message.channel.send({embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle(`✅ | Password Changed Succesufuly`)
                    .setColor(Discord.Colors.Green)
                    .addFields({ name: 'Done', value: 'Check your [dms](https://discord.com/channels/@me/${x.channelId}) for your new password!'})
                ]}).catch(err => {
                    message.channel.send(`${err}`)
                })
                setInterval(() => {
                    x.delete().catch(err => {})
                },600000)
            }).catch(err => {
                message.channel.send(`${err}`)
            })
    } else {
        return message.reply(`:x: There was an error when updating your account password 🦺`)
    }
}