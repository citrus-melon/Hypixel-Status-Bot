const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const agoString = require('../../helpers/agoString');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class sevenDayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: '30day',
            group: 'time',
            memberName: '30day',
            description: 'Get a player\'s total playtime in the past 30 days',
            examples: ['30day', '30day citrus_melon', '30day @citrus-melon'],
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
        const username = await usernameCache.getUsernameByID(player._id);
        const embed = new MessageEmbed();
        let total = 0, untrackedCount = 0;

        for (const day of adjustedHistory) {
            if (day === null) untrackedCount++;
            total += day;
        }

        embed.addField('Total', friendlyDuration(total));
        const average = Math.round(total / 30);
        embed.addField('Average', friendlyDuration(average));
        if (untrackedCount) embed.setDescription(`*${untrackedCount} days untracked*`);

        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s 30-day playtime`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        message.reply(embed);
    }
};