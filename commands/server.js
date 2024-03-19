const User = require('./../modules/db/Users');

module.exports = { 
    name: "servers",
    description: "TestCommand",
    run: async (interaction, client) => {
        await interaction.deferReply({content: "Please wait!", ephemeral: true});
        const { textcommand_prefix } = client.framework.getConfig();
        let output = "";

        if(!client.pufferpanel.auth.isLoggedIn()) return await interaction.editReply({ content: "RestAPI Error!" } );

        const userDB = await User.findOne({ id: interaction.user.id })
        if(!userDB) return interaction.editReply(`:x: You dont have an account created. type \`${textcommand_prefix}user new\` or to create one`)
        if(userDB.ban) return interaction.editReply(`:x: You account is banned.`);

    //panelID
        for (const server of await client.pufferpanel.server.list()){

        }
        
        return await interaction.editReply({ content: "hi" });
    }
}