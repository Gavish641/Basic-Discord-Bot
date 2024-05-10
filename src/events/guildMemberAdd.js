const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const guild = client.guilds.cache.get(config.serverId)
        client.user.setActivity(`${guild.memberCount} Members!`, { type: ActivityType.Watching})
        const welcomeMessage = new EmbedBuilder()
        .setTitle("Welcome 👋")
        .setAuthor({ name: "Crazy Party", iconURL: "https://cdn.discordapp.com/attachments/1005101903312584704/1146377525866549258/unknown.png" })
        .setTimestamp()
        .setColor("#1291cc")
        .setDescription(`**Welcome ${member} to \`Crazy Party Server\`**`)
        .setFooter({ text: "Developed By Gavish", iconURL: "https://cdn.discordapp.com/attachments/1005101903312584704/1146377525866549258/unknown.png" })
        .setThumbnail(member.user.displayAvatarURL())
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("members")
            .setStyle(ButtonStyle.Primary)
            .setLabel(`${guild.memberCount} Members!`)
            .setDisabled()
        )
        guild.channels.cache.get(config.welcomeChannel).send({ embeds: [welcomeMessage], components: [button]})
    },
};