const { ActivityType, EmbedBuilder, Embed } = require('discord.js');
const config = require('D:/Bots/Crazy Party Bot/config.json')
const axios = require('axios');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');
        setInterval(() => {
            const guild = client.guilds.cache.get(config.serverId)
            axios.get(`http://181.214.214.180:30120/players.json`).then(async function (response) {
                client.user.setActivity(`(${response.data.length}/${config.maxPlayers}) | (${guild.memberCount})`, { type: ActivityType.Playing })
                let playerlist = `**\`📊\`Status: Online**\n**\`👨\`Players: [${response.data.length}/${config.maxPlayers}]**\n**\`🌌\`Space: ${parseInt((response.data.length * 100) / parseInt(config.maxPlayers))}%**\n\n`

                let serverManager = ""
                let management = ""
                let headStaff = ""
                let staff = ""

                for(let i = 1; i <= response.data.length; i++) {
                    let memberId = ""
                    for(j in response.data[i-1].identifiers) {
                        if(response.data[i-1].identifiers[j].startsWith('discord')) {
                            playerlist += `**\`(ID: ${response.data[i-1].id})\`  |  <@${response.data[i-1].identifiers[j].substring(8,)}>  \`${response.data[i-1].name}\`** \n`
                            memberId = response.data[i-1].identifiers[j].substring(8,)
                            
                        }
                    }

                    if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.serverManagerRole)) {
                        serverManager += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    else if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.managementRole)) {
                        management += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    else if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.headStaffRole)) {
                        headStaff += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    else if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.staffRole)) {
                        staff += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    
                }

                const embed = new EmbedBuilder()
                .setColor('#8a018c')
                .setFooter({ text: "Developed By Gavish" , iconURL: "https://cdn.discordapp.com/attachments/1089804298898120725/1163485326824706048/Sticker.png?ex=6548f9a6&is=653684a6&hm=073cf873e7e2250b866c3eda212bd1386998c28aa52f0b6696aad95e898bf376&"})
                .setTitle('Crazy Party RolePlay | Playerlist')
                .setDescription(playerlist)
                .setThumbnail('https://cdn.discordapp.com/attachments/1089804298898120725/1163485326824706048/Sticker.png?ex=6548f9a6&is=653684a6&hm=073cf873e7e2250b866c3eda212bd1386998c28aa52f0b6696aad95e898bf376&')
                .setTimestamp()
                const msg = await client.guilds.cache.get(config.serverId).channels.cache.get('1166778125754040330').messages.fetch('1166789614594441256')
                msg.edit({ content: "", embeds: [embed]})

                //staff playerlist
                const staffEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setFooter({ text: 'Devloped By Gavish'})
                .setTitle('Crazy Party RolePlay | Staff Playerlist')
                .setDescription(`**__Server Manager__**\n${serverManager}\n\n**__Management__**\n${management}\n\n**__Head Staff__**\n${headStaff}\n\n**__Staff__**\n${staff}`)
                .setTimestamp()
                const msg2 = await client.guilds.cache.get(config.serverId).channels.cache.get('1166789469748351006').messages.fetch('1166789581362970654')
                msg2.edit({ content: "", embeds: [staffEmbed]})
            }).catch(async function (error) {
                console.log(error)
                client.user.setActivity(`Server Offline | (${guild.memberCount})`, { type: ActivityType.Playing })
                const embed = new EmbedBuilder()
                .setColor('Red')
                .setFooter({ text: "Developed By Gavish" })
                .setTitle('Crazy Party RolePlay | Playerlist')
                .setDescription(`**\`📊\`Status: Offline**\n**`)
                .setTimestamp()
                const msg = await client.guilds.cache.get(config.serverId).channels.cache.get('1166778125754040330').messages.fetch('1166789614594441256')
                msg.edit(embed)
            })
        }, 10000)

    },
};

