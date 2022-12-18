const Discord = require('discord.js');
const { bot, staff } = require('./../../config.json');
const User = require('../../modules/Users');

// panel api
const token = require('./../../connect/token');
const RemoveUser = require('./../../connect/user/delete');

module.exports = async (client, message, args) => {
    const user = message.author;
    const pinuser = message.mentions.users.first();
    if(!staff.admin.includes(user.id) && staff.owner !== user.id) return message.reply(`:x: You dont have permission to use this command!`)
    if(!pinuser) return message.reply(`:x: Please include user to unlink`)
    if(staff.owner == pinuser.id) return message.reply(`:no_pedestrians: Owner can't be unlink`)
    const _token = await token();
    const userDB = await User.findOne({ id: pinuser.id })
    if(!userDB) return message.reply(`:x: I dont find this account`);
    const usr = await RemoveUser(_token.token, _type.type, userDB.panelID);
    if(user) message.reply(`:x: I can't Find this account in panel database but i continue to remove it from interact database!`);
    await userDB.delete();
    return message.reply(`:wave: Ok user ${pinuser.username} have be removed!..`);
}
