const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('ticket-block')
    .setDescription('Block a member from opening tickets')
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
        if(user.roles.cache.find(role => role.id === config.ticketBlockRoleId)) {
            return interaction.reply({ content: `${user} Already Has A Ticket Block`, ephemeral: true })
        }
        user.roles.add(config.ticketBlockRoleId)
        interaction.reply({ content: `${user} Got Ticket Block Successfully!` })
    }
}