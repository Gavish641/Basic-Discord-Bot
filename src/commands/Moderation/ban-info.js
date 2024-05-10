const { SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs')
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
data:new SlashCommandBuilder()
    .setName('ban-info')
    .setDescription('Search For A Ban')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(info =>
        info
        .setName('info')
        .setDescription('Member info by id')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const info = interaction.options.getString('info')
        const bansU = await interaction.guild.bans.fetch()
        let banT = bansU.find(ban => ban.user.id === info)
        if(!banT) {
            return interaction.reply(`\`No bans for ${info}\``)
        }
        const banInfo = `> **User: <@${banT.user.id}> \`(${banT.user.tag})\`**\n> **Reason: \`${banT.reason || 'No reason provided'}\`**`

        
        
       
        interaction.reply({ content: banInfo })
        
    }
}