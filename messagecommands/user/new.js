const Discord = require('discord.js');
const { color, bot, panel, max } = require('../../config.json');
const User = require('../../modules/Users');
const validator = require('validator');
const moment = require("moment");
const wait = require('node:timers/promises').setTimeout;

// panel api

const token = require('../../connect/token');
const addUser = require('../../connect/user/create');

module.exports = async (client, message, args) => {
    const userDB = await User.findOne({ id: message.author.id });
    if (userDB) {
        message.reply(":x: You already have a `panel account` linked to your discord account");
        return;
    }
    let getPassword = () => {
        const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };
    let category = message.guild.channels.cache.find(c => c.id === bot.createAccount);
    let channel = await message.guild.channels.create({
        name: `${message.author.username}-${message.author.discriminator}`,
        parent: category.id,
        type: Discord.ChannelType.GuildText,
        permissionOverwrites: [{
            id: message.author.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        }, {
            id: message.guild.id,
            deny: ["ViewChannel", "SendMessages"],
        }]
    })
    message.reply(`Please check ${channel} to create your account!`)
    let msg = await channel.send({
        content: `${message.author}`,
        embeds:[
            new Discord.EmbedBuilder()
            .setTitle(`👋 Welcome to SMP Hosting`)
            .setColor(0x677bf9)
            .setDescription(`📰 In order to continue, please read our terms of service and privacy policy that are located in the channel ${client.channels.cache.get(bot.legal)}.\n\nYou are allowed to continue creating your account and use our servicies only if you accept our terms of service and privacy policy\n\nDo you accept our legal?`)
            .setFooter({text:`This message expires in 5 minutes`})
        ],
        components:[
            new Discord.ActionRowBuilder()
            .addComponents(
				new Discord.ButtonBuilder()
					.setCustomId('AcceptLegal')
					.setLabel('Yes')
					.setStyle('Success'),
			)
            .addComponents(
				new Discord.ButtonBuilder()
					.setCustomId('RejectLegal')
					.setLabel('No')
					.setStyle('Danger'),
			)
        ]
    })

    
    const filter = i => i.user.id === message.author.id;
    const legalCollector = msg.createMessageComponentCollector({ filter, time: 300000 });

    let email
    let username

    legalCollector.on('collect', async legalInteraction => {
        legalInteraction.deferUpdate()
        if(legalInteraction.customId === "RejectLegal") return legalCollector.stop('RejectLegal')
        if(legalInteraction.customId === "AcceptLegal") return legalCollector.stop('Success')
    })

    legalCollector.on('end', async(a, reason) => {
        if(reason === 'time'){
            channel.send(`${error} Time had expired, i am closing this channel`)
            await wait(3000)
            try{ channel.delete() }catch(err){}
            return
        }
        if(reason === 'RejectLegal'){
            channel.send(`${error} Without accepting our legal, we will now allow you to create an account and use our servicies`)
            await wait(5000)
            try{ channel.delete() }catch(err){}
            return
        }

        if(reason === 'Success'){
            const filter = m => m.author.id === message.author.id;
            const collector = channel.createMessageCollector({ filter, time: 300000 });

            msg.edit({
                embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle(`❓ What is your email address? (should be valid)`)
                    .setColor(Discord.Colors.Yellow)
                    .setFooter({text:`Type "cancel" to stop the process of creating your account`})
                ],
                components: []
            })
            

            collector.on('collect', async m => {
                
                if(m.content.toLowerCase() === "cancel") return collector.stop("cancelingCreation")
                try{m.delete()}catch(err){}

                if(!email){
                    if(!validator.isEmail(m.content.toLowerCase().trim())){
                        let tempmsg = await channel.send(':x: The email you send is not valid, try sending again your email...')
                        await wait(1500)
                        tempmsg.delete()
                        return
                    }else{
                        msg.edit({
                            embeds:[
                                new Discord.EmbedBuilder()
                                .setTitle(`❓ What your username should be (do not use spaces or special charaters also minimum lenght is 8)`)
                                .setColor(Discord.Colors.Yellow)
                                .setFooter({text:`Type "cancel" to stop the process of creating your account`})
                            ],
                            components: []
                        })
                        email = m.content.toLowerCase().trim()
                    }
                }else if(!username){
                    if(m.content.trim().split(" ").length > 1) {
                        let tempmsg = await channel.send(`${error} The username must not have spaces or special characters, try sending again`)
                        await wait(1500)
                        tempmsg.delete()
                        return
                    }else{
                        msg.edit({
                            embeds:[
                                new Discord.EmbedBuilder()
                                .setTitle(`⌛ Processing creating your account`)
                                .setColor(Discord.Colors.Yellow)
                            ]
                        })
                        username = m.content.toLowerCase().trim()
                        collector.stop("FinishedCreation")
                    }
                }
            })

            collector.on('end', async (collected, reason) => {
                if(reason === 'time'){
                    channel.send(`${error} Time had expired, i am closing this channel`)
                    await wait(3000)
                    try{ channel.delete() }catch(err){}
                    return
                } 
                if(reason === 'cancelingCreation'){
                    channel.send('Account creation cancelled, deleting channel . . .')
                    await wait(3000)
                    try{ channel.delete() }catch(err){}
                    return
                } 

                if(reason === 'FinishedCreation'){
                    if(!username || !email) return msg.edit({
                        embeds:[
                            new Discord.EmbedBuilder()
                            .setTitle(`${error} Something wierd happend...`)
                            .setColor(Discord.Colors.Red)
                            .setDescription(`Error: The email or username cache did not save any record!`)
                        ]
                    })

                    const _token = await token();
                    const data = {
                        username: username.toLowerCase(),
                        email: email.toLowerCase(),
                        password: getPassword()
                    }
                    const _user = await addUser(_token.token, _token.type, data.username, data.email, data.password);
                    if(_user){
                        //message.member.roles.add(message.guild.roles.cache.get(config.roleID.client))
                        const db = await new User({
                            id: message.author.id,
                            username: data.username,
                            password: data.password,
                            panelID: _user,
                            email: data.email,
                            max: max,
                            used: 0
                        });
                        db.save();
                        msg.edit({
                            content: `${message.author}`,
                            embeds: [
                                new Discord.EmbedBuilder()
                                .setTitle(`Your account was successfully created`)
                                .setColor(0x677bf9)
                                .setDescription(`Here are the account details:\n\n> panel link: ${panel.url}\n> email: \`${email}\`\n> username: \`${username}\`\n> password: || ${data.password} ||\n\nMake sure you will change your password *(after you login)* by accessing the top right account icon on the panel, from there you will have to type your curent password which is marked above and your new password.\n\n⚠️ *This channel will be deleted in 30 minues, make sure you saved your login data before the channel gets deleted*`)
                            ]
                        })
                        await wait(1800000)
                        try{ channel.delete() }catch(err){ msg.channel.send(`There was an error deleting the channel!\n${err}`).catch(err => {})}
                    } else {
                        //error
                        msg.edit({
                            embeds:[
                                new Discord.EmbedBuilder()
                                .setTitle(`Something happend :/`)
                                .setColor(Discord.Colors.Red)
                                .setDescription(`There was an error when creating your account 🦺`)
                            ]
                        })
                        channel.send(`This channel will be deleted in 10 seconds . . .`)
                       // fs.appendFileSync('./logs/errorCreatingAccount.txt', `\n\n\n${Date.now()} -> ${err}`);
                        await wait(10000)
                        try{ channel.delete() }catch(err){}
                    }
                }
            })
        }
    })

};