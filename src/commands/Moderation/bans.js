const { SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs')
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
data:new SlashCommandBuilder()
    .setName('bans')
    .setDescription('Search For A Ban')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(info =>
        info
        .setName('info')
        .setDescription('Member info')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const info = interaction.options.getString('info')
        const bansU = await interaction.guild.bans.fetch()
        let banT = bansU.find(ban => ban.user.id === info)
        let banT2 = []
        let count = 0
        if(!banT) {
            bansU.forEach(ban => {
                if(ban.user.username.toLowerCase().includes(info)) {
                    banT2[count] = ban
                    count++
                }
            })
        }
        if(!banT && !banT2) {
            return interaction.reply(`\`No bans for ${info}\``)
        }
        let banInfo = ""
        if(banT2) {
            for(let i = 0; i < banT2.length; i++) {
                banInfo += `> **User: <@${banT2[i].user.id}> \`(${banT2[i].user.tag})\`**\n\n`
            }
        }
        
        
       
        interaction.reply({ content: banInfo })
        
    }
}