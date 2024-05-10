const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('remove-ticket-block')
    .setDescription("Remove the 'ticket block' role")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const userId = interaction.options.getUser('user').id
        const user = interaction.guild.members.cache.get(userId)
        if(!user.roles.cache.find(role => role.id === config.ticketBlockRoleId)) {
            return interaction.reply({ content: `${user} hasn't the ticket block role`, ephemeral: true })
        }
        user.roles.remove(config.ticketBlockRoleId)
        interaction.reply({ content: `The Ticket Block Removed From ${user} Successfully!` })
    }
}