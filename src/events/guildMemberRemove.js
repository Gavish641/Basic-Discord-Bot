const { ActivityType, EmbedBuilder } = require('discord.js');
const config = require('D:/Bots/Crazy Party Bot/config.json')
module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const guild = client.guilds.cache.get(config.serverId)
        client.user.setActivity(`${guild.memberCount} Members!`, { type: ActivityType.Watching})

    },
};