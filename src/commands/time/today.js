const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class todayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'time',
            memberName: 'today',
            description: 'Get a player\'s total tracked playtime today, since midnight',
            examples: ['today', 'today citrus_melon', 'today @citrus-melon'],
            throttling: {duration: 10, usages: 5},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'Whoose stats would you like to get? Enter a Minecraft username or mention a Discord user',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyHistory: 1, lastIncremented: 1});
        if (typeof player === 'string') { message.reply(player); return; }

        const adjustedHistory = playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date());
        const value = adjustedHistory[0];
        const username = await usernameCache.getUsernameByID(player._id);
        
        const embed = new MessageEmbed();
        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s playtime today`);
        embed.setDescription(`${username} has played for **${friendlyDuration(value)}** in total today!`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        message.reply(embed);
    }
};