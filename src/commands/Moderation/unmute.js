const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute Member')
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
        if(!user.roles.cache.find(role => role.id === config.muteRoleId)) {
            return interaction.reply({ content: `${user} is not muted`, ephemeral: true })
        }
        user.roles.remove(config.muteRoleId)
        interaction.reply({ content: `${user} unmuted successfully!` })
        
        
    }
}