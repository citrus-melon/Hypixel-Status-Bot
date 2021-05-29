const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const agoString = require('../../helpers/agoString');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class monthPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'month',
            aliases: ['m', 'monthtotal', 'thismonth', 'tm'],
            group: 'time',
            memberName: 'month',
            description: 'Get a player\'s total tracked playtime during a certain month.',
            details: 'Optionally pecify a month using the number of months ago. For example, 1 is last month.',
            examples: ['month', 'month citrus_melon', 'month @citrus-melon'],
            throttling: {duration: 10, usages: 5},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'Whoose stats would you like to get? Enter a Minecraft username or mention a Discord user.',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                },
                {
                    key: 'monthsAgo',
                    type: 'integer',
                    label: 'months ago',
                    prompt: 'How many months ago is the month you would like to get? (Ex. last month = 1)',
                    min: 0,
                    default: 0
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account, monthsAgo }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account, {monthlyHistory: 1, lastIncremented: 1});
        if (typeof player === 'string') return message.reply(player);

        const adjustedHistory = playerHelpers.adjustMonthlyHistory(player.monthlyHistory, player.lastIncremented, new Date());
        const value = adjustedHistory[monthsAgo];
        const username = await usernameCache.getUsernameByID(player._id);
        const embed = new MessageEmbed();

        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s total playtime ${agoString.months(monthsAgo)}`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);

        if (value === null || value === undefined) embed.setDescription(`${username} wasn't tracked ${agoString.months(monthsAgo)}!`);
        else embed.setDescription(`${username} played **${friendlyDuration(value)}** in total ${agoString.months(monthsAgo)}!`);

        return message.reply(embed);
    }
};