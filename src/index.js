const { ActivityType, MessageEmbed, ButtonBuilder, ActionRowBuilder , Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, messageLink, UserSelectMenuBuilder, userMention, ActivityFlagsBitField, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, AuditLogEvent } = require(`discord.js`);
const fs = require('fs');
const internal = require('stream');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans] }); 
const config = require('D:/Bots/Crazy Party Bot/config.json')
const ticket = require('D:/Bots/Crazy Party Bot/ticket.json')

const discordTranscripts = require('discord-html-transcripts');

client.commands = new Collection();

require('dotenv').config();
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)  
})();


client.on(Events.MessageCreate, async message => {

    const urlRegex = /https?:\/\/\S+/;
    if(urlRegex.test(message.content)) {
        if(message.member.permissions.has('Administrator')) return;
        if(message.channel.id !== config.clipChannel && message.channel.id !== config.livesChannel) {
            message.member.send(`**> You can't send links in this channel.**`).catch(err => {})
            message.delete()
        }
    }

    if (message.content === '!getWaitingRole') {
        if(!message.member.permissions.has('Administrator')) return;
        const embed = new EmbedBuilder()
        .setColor('Green')
        .setFooter({ text: "Developed By Gavish"})
        .setTitle("Waiting For Allowlist Test")
        .setDescription(`> In order to get the <@&${config.waitingRole}> role click the button below.`)
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('waiting')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔰')
        )
        message.channel.send({ embeds: [embed], components: [button]})
    }

    if(message.content === "!verify") {
        if(!message.member.permissions.has('Administrator')) return
        const embed = new EmbedBuilder()
        .setTitle("Verify System")
        .setDescription(`**In order to get the <@&${config.memberId}>, press the button below**`)
        .setColor('Green')
        .setAuthor({ name: "Crazy Party Server", iconURL: "https://cdn.discordapp.com/attachments/1005101903312584704/1146377525866549258/unknown.png"})
        .setFooter({ text: "Developed By Gavish", iconURL: "https://cdn.discordapp.com/attachments/1005101903312584704/1146377525866549258/unknown.png"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("verify")
            .setEmoji('901093240923631716')
            .setStyle(ButtonStyle.Success)
        )
        message.channel.send({ embeds: [embed], components: [button]})
    }

    if(message.content.toLowerCase().startsWith("!say ")) {
        if(!message.member.permissions.has('Administrator')) return
        const args = message.content.split(/\s+/)
        const commandName2 = args.shift().substring(1)
        const msg = args.join(' ')
        message.channel.send(msg)
    }

    if(message.content.toLowerCase().startsWith("!sug ")) {
        message.delete()
        if(!message.member.permissions.has('Administrator')) {
            if(message.channel.id !== config.commandsChannelId) {
                return message.reply(`> Command can use only here: <#${config.commandsChannelId}>`)
            }
        }
        const args = message.content.split(/\s+/)
        const commandName2 = args.shift().substring(1)
        const sug = args.join(' ')
        const embed = new EmbedBuilder()
        .setTitle("Suggestions System")
        .setColor("#000000")
        .setDescription(`${sug} \n\n (${message.member})`)
        .setFooter({ text: "Developed By Gavish"})
        client.guilds.cache.get(config.serverId).channels.cache.get(config.sugChannelId).send({ embeds: [embed] }).then(msg => {
            msg.react('✅')
            msg.react('❌')
        })
    }

    if(message.content === "!ticketE") {
        if(!message.member.permissions.has('Administrator')) return
        const embed = new EmbedBuilder()
        .setColor('#349eeb')
        .setTitle("Ticket System")
        .setDescription("In order to open a ticket, click the button below")
        .setFooter({ text: "Developed By Gavish "})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji('🎫')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ticket')
        )
        message.channel.send({ embeds: [embed], components: [button] })
    }
    
    if(message.content.toLowerCase() === "?cc") {
        if(!message.member.permissions.has('Administrator') && !message.member.roles.cache.find(role => role.id === config.headStaffRole)) return
        if(message.channel.parent.id !== config.crazyParent && message.channel.parent.id !== config.legalParent && message.channel.parent.id !== config.illegalParent && message.channel.parent.id !== config.birurParent && message.channel.parent.id !== config.donationParent && message.channel.parent.id !== config.reportParent && message.channel.parent.id !== config.reportStaffParent && message.channel.parent.id !== config.banParent && message.channel.parent.id !== config.questionParent && message.channel.parent.id !== config.returnParent) return;
        const attachment = await discordTranscripts.createTranscript(message.channel)
        
        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription("> **The ticket will be deleted in 5 seconds**")
        setTimeout(() => {
            message.channel.send({ embeds: [embed]})
        }, 1000)
        setTimeout(() => {
            message.channel.delete()
        }, 5000)

        let target = ""

        Object.keys(ticket).forEach(key => {
            if(ticket[key].channel === message.channel.id) {
                ticket[key] = {
                    isOpen: false,
                    channel: 0
                }
                target = key
            }
        })
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })

        const embed2 = new EmbedBuilder()
        .setColor('Blue')
        .setFooter({ text: "Developed By Gavish"})
        .setTitle('Ticket Transcript')
        .addFields(
            { name: "Ticket Owner:", value: `<@${target}>`, inline: true },
            { name: 'Ticket Closer:', value: `${message.member}`}
        )
        message.guild.channels.cache.get(config.ticketLogs).send({ embeds: [embed2], files: [attachment] })
        
        
    }

    if(message.content.toLowerCase() === "?crazy") {
        if(message.channel.parent.id !== config.crazyParent && message.channel.parent.id !== config.legalParent && message.channel.parent.id !== config.illegalParent && message.channel.parent.id !== config.birurParent && message.channel.parent.id !== config.donationParent && message.channel.parent.id !== config.reportParent && message.channel.parent.id !== config.reportStaffParent && message.channel.parent.id !== config.banParent && message.channel.parent.id !== config.questionParent && message.channel.parent.id !== config.returnParent) return;
        if(!message.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) return message.reply("**> You don't have an access to use this command**")
        message.channel.setParent(config.crazyParent)
        message.reply("**> The ticket category successfully changed to __Crazy's Category__ !**")
    }

    if(message.content.toLowerCase() === "?legal") {
        if(message.channel.parent.id !== config.crazyParent && message.channel.parent.id !== config.legalParent && message.channel.parent.id !== config.illegalParent && message.channel.parent.id !== config.birurParent && message.channel.parent.id !== config.donationParent && message.channel.parent.id !== config.reportParent && message.channel.parent.id !== config.reportStaffParent && message.channel.parent.id !== config.banParent && message.channel.parent.id !== config.questionParent && message.channel.parent.id !== config.returnParent) return;
        if(!message.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) return message.reply("**> You don't have an access to use this command**")
        message.channel.setParent(config.legalParent)
        message.reply("**> The ticket category successfully changed to __Police Category__ !**")
    }

    if(message.content.toLowerCase() === "?illegal") {
        if(message.channel.parent.id !== config.crazyParent && message.channel.parent.id !== config.legalParent && message.channel.parent.id !== config.illegalParent && message.channel.parent.id !== config.birurParent && message.channel.parent.id !== config.donationParent && message.channel.parent.id !== config.reportParent && message.channel.parent.id !== config.reportStaffParent && message.channel.parent.id !== config.banParent && message.channel.parent.id !== config.questionParent && message.channel.parent.id !== config.returnParent) return;
        if(!message.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) return message.reply("**> You don't have an access to use this command**")
        message.channel.setParent(config.illegalParent)
        message.reply("**> The ticket category successfully changed to __Crime Category__ !**")
    }

    if(message.content.toLowerCase() === "?dev") {
        if(message.channel.parent.id !== config.crazyParent && message.channel.parent.id !== config.legalParent && message.channel.parent.id !== config.illegalParent && message.channel.parent.id !== config.birurParent && message.channel.parent.id !== config.donationParent && message.channel.parent.id !== config.reportParent && message.channel.parent.id !== config.reportStaffParent && message.channel.parent.id !== config.banParent && message.channel.parent.id !== config.questionParent && message.channel.parent.id !== config.returnParent) return;
        if(!message.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) return message.reply("**> You don't have an access to use this command**")
        message.channel.setParent(config.devParent)
        message.reply("**> The ticket category successfully changed to __DEV Category__ !**")
    }

    if(message.content.toLowerCase() === "?ped") {
        if(message.channel.parent.id !== config.crazyParent && message.channel.parent.id !== config.legalParent && message.channel.parent.id !== config.illegalParent && message.channel.parent.id !== config.birurParent && message.channel.parent.id !== config.donationParent && message.channel.parent.id !== config.reportParent && message.channel.parent.id !== config.reportStaffParent && message.channel.parent.id !== config.banParent && message.channel.parent.id !== config.questionParent && message.channel.parent.id !== config.returnParent) return;
        if(!message.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) return message.reply("**> You don't have an access to use this command**")
        message.channel.setParent(config.pedParent)
        message.reply("**> The ticket category successfully changed to __Ped Category__ !**")
    }
})




client.on(Events.InteractionCreate, async interaction => {
    //-------------------------------------------------verify------------------------------------------------------
    if(interaction.customId === "verify") {
        const vRole = interaction.guild.roles.cache.get(config.memberId)
        interaction.member.roles.add(vRole)
        interaction.reply({ content: "You are now successfully verified!", ephemeral: true })
    }

    if(interaction.customId === "waiting") {
        if(interaction.member.roles.cache.find(role => role.id === config.waitingRole)) {
            interaction.member.roles.remove(config.waitingRole)
            return interaction.reply({ content: `The <@&${config.waitingRole}> Has Successfully Removed!`, ephemeral: true})
        }
        interaction.member.roles.add(config.waitingRole)
        interaction.reply({ content: `The <@&${config.waitingRole}> Has Successfully Added!`, ephemeral: true})
    }
    //-------------------------------------------------end of verify------------------------------------------------
    
    if(interaction.customId === "ticket") {
        if(ticket[interaction.member.id]) {
            if(ticket[interaction.member.id].channel !== 0) {
                const ch = interaction.guild.channels.cache.find(ticket[interaction.member.id].channel)
                if(!ch) {
                    ticket[interaction.member.id] = {
                        isOpen: false,
                        channel: 0
                    }
                    fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
                        if(err) console.log(err)
                    })
                }
            }
        }

        
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) {            
            return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        }
        const menu = new StringSelectMenuBuilder()
            .setCustomId('ticketOption')
            .setPlaceholder('Ticket Options')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(
                new StringSelectMenuOptionBuilder({
                    label: 'שאלה',
                    value: 'question'
                }), 
                new StringSelectMenuOptionBuilder({
                    label: 'תרומה',
                    value: 'donation'
                }),
                new StringSelectMenuOptionBuilder({
                    label: 'תלונה על שחקן',
                    value: 'report'
                }),
                new StringSelectMenuOptionBuilder({
                    label: 'תלונה על צוות',
                    value: 'reportStaff'
                }), 
                new StringSelectMenuOptionBuilder({
                    label: 'ערעור על באן',
                    value: 'ban'
                }), 
                new StringSelectMenuOptionBuilder({
                    label: 'החזרת דברים',
                    value: 'return'
                }),
                new StringSelectMenuOptionBuilder({
                    label: 'בירור',
                    value: 'birur',
                    description: 'Staff Only'
                })
            )
        await interaction.reply({ components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true})

    }

    if(interaction.customId === "closeTicket") {
        if(!interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole) && !interaction.member.permissions.has('Administrator')) {
            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('close')
                .setStyle('Danger')
                .setEmoji('🗑')
            )
            return interaction.reply({ content: `${interaction.user.tag} request to close the ticket`, components: [button] })
        }
        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('close')
            .setStyle('Danger')
            .setEmoji('🗑'),
            new ButtonBuilder()
            .setCustomId('cancel')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Cancel')
        )
        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription("Are you sure you want to close the ticket?")
        interaction.reply({ embeds: [embed], components: [buttons]})
    }

    if(interaction.customId === "cancel") {
        if(!interaction.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) {
            return interaction.reply({ content: "Your not a staff member", ephemeral: true })
        }
        interaction.message.delete()
    }

    if(interaction.customId === "close") {
        if(!interaction.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) {
            return interaction.reply({ content: "Your not a staff member", ephemeral: true })
        }
        setTimeout(() => {
            interaction.message.delete()
        }, 2000)    
        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription("> **The ticket will be deleted in 5 seconds**")
        interaction.deferReply()
        setTimeout(() => {
            interaction.editReply({ embeds: [embed]})
        }, 1000)
        setTimeout(() => {
            interaction.channel.delete()
        }, 5000)
        let target = ""
        Object.keys(ticket).forEach(key => {
            if(ticket[key].channel === interaction.channel.id) {
                ticket[key] = {
                    isOpen: false,
                    channel: 0
                }
                target = key
            }
        })
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
        const attachment = await discordTranscripts.createTranscript(interaction.channel)

        const embed2 = new EmbedBuilder()
        .setColor('Blue')
        .setFooter({ text: "Developed By Gavish"})
        .setTitle('Ticket Transcript')
        .addFields(
            { name: "Ticket Owner:", value: `<@${target}>`, inline: true },
            { name: 'Ticket Closer:', value: `${interaction.member}`}
        )
        interaction.guild.channels.cache.get('1166796876507512862').send({ embeds: [embed2], files: [attachment] })
    }
})


//-----------------------------------------------------------------Tickets-----------------------------
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isAnySelectMenu()) return;

    if(interaction.values[0] === "question") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('questionModal')
        .setTitle('שאלה')
        const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('שם')
        .setStyle(TextInputStyle.Short)
        const question = new TextInputBuilder()
        .setCustomId('question')
        .setLabel('שאלה')
        .setStyle(TextInputStyle.Paragraph)

        const questionRow = new ActionRowBuilder().addComponents(question)
        const nameRow = new ActionRowBuilder().addComponents(name)
        modal.addComponents(nameRow, questionRow);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "donation") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('donationModal')
        .setTitle('תרומה')
        const name2 = new TextInputBuilder()
        .setCustomId('name2')
        .setLabel('שם')
        .setStyle(TextInputStyle.Short)
        const amount = new TextInputBuilder()
        .setCustomId('amount')
        .setLabel('סכום התרומה')
        .setStyle(TextInputStyle.Short)
        const date = new TextInputBuilder()
        .setCustomId('date')
        .setLabel('תאריך התרומה')
        .setStyle(TextInputStyle.Short)
        const proof = new TextInputBuilder()
        .setCustomId('proof')
        .setLabel('הוכחה')
        .setStyle(TextInputStyle.Short)

        const nameRow = new ActionRowBuilder().addComponents(name2)
        const amountRow = new ActionRowBuilder().addComponents(amount)
        const dateRow = new ActionRowBuilder().addComponents(date)
        const proofRow = new ActionRowBuilder().addComponents(proof)
        modal.addComponents(nameRow, amountRow, dateRow, proofRow);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "report") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('reportModal')
        .setTitle('תלונה על שחקן')
        const name3 = new TextInputBuilder()
        .setCustomId('name3')
        .setLabel('שם השחקן עליו התלונה')
        .setStyle(TextInputStyle.Short)
        const id = new TextInputBuilder()
        .setCustomId('id')
        .setLabel('ID / DISCORD ID של אותו שחקן')
        .setStyle(TextInputStyle.Short)
        const details = new TextInputBuilder()
        .setCustomId('details')
        .setLabel('פרטי התלונה')
        .setStyle(TextInputStyle.Paragraph)
        const proof2 = new TextInputBuilder()
        .setCustomId('proof2')
        .setLabel('הוכחה')
        .setStyle(TextInputStyle.Short)

        const nameRow = new ActionRowBuilder().addComponents(name3)
        const idRow = new ActionRowBuilder().addComponents(id)
        const detailsRow = new ActionRowBuilder().addComponents(details)
        const proof2Row = new ActionRowBuilder().addComponents(proof2)
        modal.addComponents(nameRow, idRow, detailsRow, proof2Row);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "reportStaff") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('reportStaffModal')
        .setTitle('תלונה על צוות')
        const name4 = new TextInputBuilder()
        .setCustomId('name4')
        .setLabel('שם הצוות עליו התלונה')
        .setStyle(TextInputStyle.Short)
        const id2 = new TextInputBuilder()
        .setCustomId('id2')
        .setLabel('ID / DISCORD ID של אותו צוות')
        .setStyle(TextInputStyle.Short)
        const details2 = new TextInputBuilder()
        .setCustomId('details2')
        .setLabel('פרטי התלונה')
        .setStyle(TextInputStyle.Paragraph)
        const proof3 = new TextInputBuilder()
        .setCustomId('proof3')
        .setLabel('הוכחה')
        .setStyle(TextInputStyle.Short)

        const nameRow = new ActionRowBuilder().addComponents(name4)
        const idRow = new ActionRowBuilder().addComponents(id2)
        const details2Row = new ActionRowBuilder().addComponents(details2)
        const proof3Row = new ActionRowBuilder().addComponents(proof3)
        modal.addComponents(nameRow, idRow, details2Row, proof3Row);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "ban") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('banModal')
        .setTitle('ערעור על באן')
        const name5 = new TextInputBuilder()
        .setCustomId('name5')
        .setLabel('שם')
        .setStyle(TextInputStyle.Short)
        const staff = new TextInputBuilder()
        .setCustomId('staff')
        .setLabel('נותן הבאן')
        .setStyle(TextInputStyle.Short)
        const reason = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('סיבה להורדת הבאן')
        .setStyle(TextInputStyle.Paragraph)
        const image = new TextInputBuilder()
        .setCustomId('image')
        .setLabel('תמונה של הבאן')
        .setStyle(TextInputStyle.Short)

        const nameRow = new ActionRowBuilder().addComponents(name5)
        const staffRow = new ActionRowBuilder().addComponents(staff)
        const reasonRow = new ActionRowBuilder().addComponents(reason)
        const imageRow = new ActionRowBuilder().addComponents(image)
        modal.addComponents(nameRow, staffRow, reasonRow, imageRow);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "return") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('returnModal')
        .setTitle('החזרת דברים')
        const name6 = new TextInputBuilder()
        .setCustomId('name6')
        .setLabel('שם')
        .setStyle(TextInputStyle.Short)
        const date2 = new TextInputBuilder()
        .setCustomId('date2')
        .setLabel('מתי נעלמו הדברים?')
        .setStyle(TextInputStyle.Short)
        const items = new TextInputBuilder()
        .setCustomId('items')
        .setLabel('מה נעלם?')
        .setStyle(TextInputStyle.Paragraph)
        const proof4 = new TextInputBuilder()
        .setCustomId('proof4')
        .setLabel('הוכחה')
        .setStyle(TextInputStyle.Short)

        const name6Row = new ActionRowBuilder().addComponents(name6)
        const date2Row = new ActionRowBuilder().addComponents(date2)
        const itemsRow = new ActionRowBuilder().addComponents(items)
        const proof4Row = new ActionRowBuilder().addComponents(proof4)
        modal.addComponents(name6Row, date2Row, itemsRow, proof4Row);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "birur") {
        if(!interaction.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) {
            return interaction.reply({ content: "This ticket categoty is for the staff only.", ephemeral: true })
        }

        const modal = new ModalBuilder()
        .setCustomId('birurModal')
        .setTitle('בירור')
        const target = new TextInputBuilder()
        .setCustomId('target')
        .setLabel('discord id')
        .setStyle(TextInputStyle.Short)
        const removeAllowlist = new TextInputBuilder()
        .setCustomId('removeAllowlist')
        .setLabel('להוריד אלווליסט?')
        .setPlaceholder("V - to remove | X - else")
        .setStyle(TextInputStyle.Short)
        

        const targetRow = new ActionRowBuilder().addComponents(target)
        const removeAllowlistRow = new ActionRowBuilder().addComponents(removeAllowlist)
        modal.addComponents(targetRow, removeAllowlistRow);
        await interaction.showModal(modal);
    }
})

//Modal Submit Event
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isModalSubmit()) return;

    if(interaction.customId === "questionModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.questionParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שם: ${interaction.fields.getTextInputValue('name')} \n \n שאלה: ${interaction.fields.getTextInputValue('question')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: שאלה`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&${config.staffRole}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "donationModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.donationParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שם: ${interaction.fields.getTextInputValue('name2')} \n \n סכום התרומה: ${interaction.fields.getTextInputValue('amount')} \n \n תאריך התרומה: ${interaction.fields.getTextInputValue('date')} \n \n הוכחה: ${interaction.fields.getTextInputValue('proof')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: תרומה`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&${config.staffRole}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "reportModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.reportParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שם השחקן עליו התלונה: ${interaction.fields.getTextInputValue('name3')} \n \n דיסקורד איידי של אותו שחקן: ${interaction.fields.getTextInputValue('id')} \n \n פרטי התלונה: ${interaction.fields.getTextInputValue('details')} \n \n הוכחה: ${interaction.fields.getTextInputValue('proof2')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: תלונה על שחקן`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&${config.staffRole}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "reportStaffModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.reportStaffParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שם הצוות עליו התלונה: ${interaction.fields.getTextInputValue('name4')} \n \n דיסקורד איידי של אותו שחקן: ${interaction.fields.getTextInputValue('id2')} \n \n פרטי התלונה: ${interaction.fields.getTextInputValue('details2')} \n \n הוכחה: ${interaction.fields.getTextInputValue('proof3')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: תלונה על צוות`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&${config.staffRole}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "banModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.banParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שם: ${interaction.fields.getTextInputValue('name5')} \n \n נותן הבאן: ${interaction.fields.getTextInputValue('staff')} \n \n סיבה להורדת הבאן: ${interaction.fields.getTextInputValue('reason')} \n \n תמונה של הבאן:: ${interaction.fields.getTextInputValue('image')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: ערעור על באן`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&${config.staffRole}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "returnModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.returnParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שם: ${interaction.fields.getTextInputValue('name6')} \n \n מתי נעלמו הדברים?: ${interaction.fields.getTextInputValue('date2')} \n \n מה נעלם?: ${interaction.fields.getTextInputValue('items')} \n \n הוכחה: ${interaction.fields.getTextInputValue('proof4')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: החזרת דברים`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@${interaction.fields.getTextInputValue('target')}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "birurModal") {
        const user = await interaction.guild.members.fetch(interaction.fields.getTextInputValue('target'))
        if(interaction.fields.getTextInputValue('removeAllolist').toLowerCase() === 'v') {
            user.roles.remove(config.allowlistRole)
        }
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.birurParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.headStaffRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.managementRole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Crazy Party RolePlay | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`שחקן: ${interaction.fields.getTextInputValue('target')} \n \n להוריד אלווליסט?: ${interaction.fields.getTextInputValue('removeAllowlist')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: בירור`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@${interaction.fields.getTextInputValue('target')}> & ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })

    }
})
//--------------------------------------------------------------End Of Tickets-----------------------------
//Boost
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.find(role => role.id === "1121869823614402571")
    const hasRole = newMember.roles.cache.find(role => role.id === "1121869823614402571")

    if(!hadRole && hasRole) {
        const embed = new EmbedBuilder()
        .setDescription(`Thanks for the boost ${newMember} !`)
        .setColor("#f47fff")
        client.guilds.cache.get(config.serverId).channels.cache.get(config.boostsChannelId).send({ embeds: [embed] })
    }
})



//----------------------------------------------------------------------LOGS-------------------------------------

