const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

const DAY_AGO_NAMES = ['Today', 'Yesterday', '2 Days Ago', '2 Days Ago', '4 Days Ago', '5 Days Ago', '6 Days Ago'];

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
        const player = await playerHelpers.getDiscordOrMinecraft(account);
        if (typeof player === 'string') {
            message.reply(player);
            return;
        }

        const adjustedPlayer = playerHelpers.tryChangeDays(player, new Date());
        const username = await usernameCache.getUsernameByID(player._id);
        const embed = new MessageEmbed();
        let total = adjustedPlayer.dailyHistory[29];

        for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
            const value = adjustedPlayer.dailyHistory[29-daysAgo];
            if (value === null) embed.addField(DAY_AGO_NAMES[daysAgo], '*untracked*');
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