module.exports = {
	name: "ping",
	description: "reply Pong!",
	run: async (client, interaction)=>{
		await interaction.reply(`🏓Latency is ${Math.round(client.ws.ping)}ms`);
	}
}