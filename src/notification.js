const Discord = require('discord.js');
const { getUsernameByID } = require('./usernameCache');

/** @param {Discord.Client} client */
module.exports.send = async (client, mcID, online) => {
    const notificationChannel = await client.channels.fetch(process.env.CHANNEL_ID);
    const username = await getUsernameByID(mcID);
    const embed = new Discord.MessageEmbed();
    if (online === true) {
        embed.setColor('#91ff8f');
        embed.setAuthor(username + ' is now online', 'https://crafatar.com/avatars/' + mcID)
    } else {
        embed.setColor('#ff8f8f')
        embed.setAuthor(username + ' is now offline', 'https://crafatar.com/avatars/' + mcID)
    }
    return await notificationChannel.send(embed);
}

/** @param {Discord.Client} client */
module.exports.role = async (client, discordID, online) => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const role = await guild.roles.fetch(process.env.ROLE_ID);
    const member = await guild.members.fetch(discordID);
    if (online) return await member.roles.add(role);
    else return await member.roles.remove(role);
}