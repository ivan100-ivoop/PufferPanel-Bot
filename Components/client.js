const { Events, ActivityType, Client, GatewayIntentBits, Partials, ApplicationCommandOptionType } = require('discord.js');
const commands = require('./commands');
const messagges = require('./messages');
const { bot } = require('../config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Channel] 
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(command){
      command.run(client, interaction);
    }else{
      await interaction.reply(error.notfound)
    }
});

client.on(Events.ClientReady, async () => {
  if(await commands(client)){
      await messagges(client);
      switch (bot.activity) {
				case 'playing':
          client.user.setActivity("Minecraft", { type: ActivityType.Playing });
					break;
				case 'listening':
          client.user.setActivity("Spotify", { type: ActivityType.Listening});
					break;
				case 'competing':
          client.user.setActivity("Sync" , { type: ActivityType.Competing});
					break;
				default:
					  client.user.setActivity("For Commands", { type: ActivityType.Watching});
			}
      console.log(`Logged in as ${client.user.tag}!`);
      require('./hook')(client);
  } else {
      process.exit(1);
  }
});
module.exports = client;