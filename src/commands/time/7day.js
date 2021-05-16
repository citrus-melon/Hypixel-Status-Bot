const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const daysAgoString = require('../../helpers/daysAgoString');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class sevenDayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: '7day',
            group: 'time',
            memberName: '7day',
            description: 'Get a player\'s playtime for the past 7 days',
            examples: ['7day', '7day citrus_melon', '7day @citrus-melon'],
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
        let total = adjustedHistory[29];

        for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
            const value = adjustedHistory[29-daysAgo];
            if (value === null) embed.addField(daysAgoString(daysAgo), '*untracked*');
            else embed.addField(DAY_AGO_NAMES[daysAgo], friendlyDuration(value));
            total += value;
        }
        embed.addField('Total', friendlyDuration(total));

        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s 7-day playtime`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        message.embed(embed);
    }
};