const Discord = require('discord.js');
const User = require('./../../modules/db/Users');

let getPassword = () => {
    const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var password = "";
    while (password.length < 10) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

module.exports = async (client, message, args) => {
    const { textcommand_prefix } = client.framework.getConfig();
    const { settings, url } = client.framework.getConfig("panel");
    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const userDB = await User.findOne({ id: message.author.id });
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` to create one`)
    if(userDB.ban) return message.reply(`:x: You account is banned.`);

    let password = getPassword();

        const data = {
            id: userDB.panelID,
            email: userDB.email,
            password: password,
            username: userDB.username
        }

    const update = await client.pufferpanel.user.update(userDB.panelID, data);
    if(update){
            client.users.cache.get(message.author.id).send({embeds:[
                new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Blue)
                .addFields({ name: 'Reset Password', value: `${settings.change_password}: ||**${data.password}**||` })
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