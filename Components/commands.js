const { REST } = require("@discordjs/rest");
const { bot } = require("../config.json");
const { join } = require('path');
const { readdirSync } = require("fs");
const { Routes, Collection } = require('discord.js');

module.exports = async (client) => {
    client.commands = new Collection();
    const dir = join(__dirname, `../${bot.dir}/`)
    const rest = new REST({ version: "10" }).setToken(bot.token);
    try {
        console.log("Started refreshing application [/] commands.");
        const command = readdirSync(dir).filter(files => files.endsWith(".js"));
        for (const file of command) {
            const _command = require(join(dir, file));
            client.commands.set(_command.name, _command);
        }
        await rest.put(Routes.applicationGuildCommands(bot.id, bot.guild), { body: client.commands });
        console.log("Successfully reloaded application [/] commands.");
        return true;
    } catch(error) {
        console.error(error);
        return false;
    }
}