const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const agoString = require('../../helpers/agoString');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class sevenDayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: '7day',
            aliases: ['pastweek', 'week', 'past7days', '7d', 'w', 'pw', 'p7d'],
            group: 'time',
            memberName: '7day',
            description: 'Get a player\'s playtime for the past 7 days.',
            examples: ['7day', '7day citrus_melon', '7day @citrus-melon'],
            throttling: {duration: 10, usages: 5},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'Whoose stats would you like to get? Enter a Minecraft username or mention a Discord user.',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyHistory: 1, lastIncremented: 1});
        if (typeof player === 'string') return message.reply(player);

        const adjustedHistory = playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date());
        const username = await usernameCache.getUsernameByID(player._id);
        const embed = new MessageEmbed();
        let total = 0;

        for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
            const value = adjustedHistory[daysAgo];
            if (value === null) embed.addField(agoString.days(daysAgo, true), '*untracked*');
            else embed.addField(agoString.days(daysAgo, true), friendlyDuration(value));
            total += value;
        }

        embed.addField('Total', friendlyDuration(total));
        const average = Math.round(total / 7);
        embed.addField('Average', friendlyDuration(average));

        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s 7-day playtime`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        return message.reply(embed);
    }
};