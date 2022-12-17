const Discord = require('discord.js');
const { bot, staff } = require('./../../config.json');
const User = require('../../modules/Users');

const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var getPassword = () => {
        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

// panel api
const token = require('./../../connect/token');
const UpdateUser = require('./../../connect/user/update');

module.exports = async (client, message, args) => {
    const user = message.author;
    const pinuser = message.mentions.users.first();
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    if(!pinuser) return message.reply(`:x: Please include user to get info`)
    if(staff.owner == pinuser.id) return message.reply(`:x: Owner can't be ban`)
    const _token = await token();
    const userDB = await User.findOne({ id: pinuser.id })
    if(!userDB) return message.reply(`:x: I dont find this account`)
    let password = await getPassword();
    const data = {
            id: userDB.panelID,
            email: userDB.email,
            username: userDB.username,
            newpassword: password
        }
    const update = await UpdateUser(_token.token, _token.type, data);    
    if(userDB.ban){
        userDB.ban = false;
        userDB.password = data.newpassword;
        return message.reply(`${userDB.username} is Baned From System`)
    } else {
        userDB.ban = true;
        userDB.password = data.newpassword;
        pinuser.send({embeds:[
            new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Blue)
            .addFields({ name: 'Reset Password', value: `New password for SMP Hosting: ||**${data.newpassword}**||` })
            .setFooter({text:`This message will autodestruct in 10 minutes`})
        ]})
        return message.reply(`${userDB.username} is UnBaned From System`)
    }
    await userDB.save();
}