const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('unlock-member')
    .setDescription('Unlock the ticket from a specific member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const member = interaction.options.getUser('user')
      
        if (member) {
            interaction.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: true, SendMessages: true,
            })
            .then(() => {
                interaction.reply(`**> The Ticket Has Been Unlocked For ${member}**`);
            })
            .catch(console.error);
        } else {
            interaction.reply({ content: "Please mention a valid member.", ephemeral: true });
        }
    }
}