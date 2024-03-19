const Discord = require('discord.js');
const User = require('./../../modules/db/Users');
const wait = require('node:timers/promises').setTimeout;

let getPassword = () => {
    const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var password = "";
    while (password.length < 10) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

module.exports = async (client, message, args) => {
    
    const staff = client.framework.getConfig("staff");

    if(!client.pufferpanel.auth.isLoggedIn()) return await message.reply({ content: "RestAPI Error!" } );

    const user = message.author;
    const pinuser = message.mentions.users.first();

    if(!staff.admin.includes(user.id) && !staff.owners.includes(user.id)) return message.reply(`:x: You dont have permission to use this command!`)
    
    if(!pinuser) return message.reply(`:x: Please include user to get info`)

    if(staff.owners.includes(pinuser.id)) return message.reply(`:x: Owner can't be ban`)

    const userDB = await User.findOne({ id: pinuser.id })

    if(!userDB) return message.reply(`:x: I dont find this account`)
    
    let password = getPassword();

    const data = {
        id: userDB.panelID,
        email: userDB.email,
        password: password,
        username: userDB.username
    }
    
    const update = await client.pufferpanel.user.update(userDB.panelID, data);
    
    if(!update) return message.reply(`:x: There was an error when updating your account password 🦺`);
    
    userDB.ban = !userDB.ban;
    userDB.password = data.password;

    if(!userDB.ban){
        pinuser.send({embeds:[
            new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Blue)
            .addFields({ name: 'Reset Password', value: `New password for SMP Hosting: ||**${userDB.password}**||` })
            .setFooter({text:`This message will autodestruct in 10 minutes`})
        ]}).then(async x => {
            await wait(10000)
            try{ x.delete() }catch(err){}
        });
    }

    await userDB.save();
    return message.reply(`User ${userDB.username} is ${userDB.ban ? "baned" : "unbaned"} from panel!`);
}