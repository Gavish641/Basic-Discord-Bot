const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban Member')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    )
    .addStringOption(reason =>
        reason
        .setName('reason')
        .setDescription('The reason of the ban')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const userId = interaction.options.getUser('user').id
        const reason = interaction.options.getString('reason')
        try {
            const user = interaction.guild.members.cache.get(userId)
            await user.ban({ reason })
            interaction.reply({ content: "This user got banned successfully!" })
        } catch {
            interaction.reply({ content: "You can't ban this member", ephemeral: true})
        }
    }
}