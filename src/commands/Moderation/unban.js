const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban Member')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const info = interaction.options.getUser('user').id
        const bansU = await interaction.guild.bans.fetch()
        let banT = bansU.find(ban => ban.user.id === info)
        if(!banT) {
            return interaction.reply(`\`No bans for ${info}\``)
        }
        interaction.guild.members.unban(banT.user.id)
        interaction.reply({ content: 'Succeed!', ephemeral: true })
    }
}