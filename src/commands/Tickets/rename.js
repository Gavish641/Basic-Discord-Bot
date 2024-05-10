const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename the ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addStringOption(name => 
        name
        .setName('name')
        .setDescription('New name for the ticket')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        if(interaction.channel.parent.id !== config.crazyParent && interaction.channel.parent.id !== config.policeParent && interaction.channel.parent.id !== config.crimeParent && interaction.channel.parent.id !== config.birurParent && interaction.channel.parent.id !== config.donationParent && interaction.channel.parent.id !== config.reportParent && interaction.channel.parent.id !== config.reportStaffParent && interaction.channel.parent.id !== config.banParent && interaction.channel.parent.id !== config.questionParent && interaction.channel.parent.id !== config.returnParent) return interaction.reply({ content: "You can't user this coammnd here.", ephemeral: true});
        const newName = interaction.options.getString('name')
        interaction.channel.setName(newName)
        interaction.reply({ content: `**> The Ticket Name Successfully Changed To \`${newName}\`**` })
        
        
        
    }
}