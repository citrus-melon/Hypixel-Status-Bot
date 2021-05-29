const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const agoString = require('../../helpers/agoString');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class dayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'day',
            aliases: ['today', 'daytotal'],
            group: 'time',
            memberName: 'day',
            description: 'Get a player\'s total tracked playtime on a certain day.',
            examples: ['day 3', 'day 3 citrus_melon', 'day 3 @citrus-melon'],
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
                    key: 'daysAgo',
                    type: 'integer',
                    label: 'days ago',
                    prompt: 'How many days ago is the day you would like to get? (Ex. yesterday = 1)',
                    max: 29,
                    min: 0,
                    default: 0
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account, daysAgo }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyHistory: 1, lastIncremented: 1});
        if (typeof player === 'string') { message.reply(player); return; }

        const adjustedHistory = playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date());
        const value = adjustedHistory[daysAgo];
        const username = await usernameCache.getUsernameByID(player._id);
        
        const embed = new MessageEmbed();
        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s playtime ${agoString.days(daysAgo)}`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);

        if (value === null) embed.setDescription(`${username} wasn't tracked ${agoString.days(daysAgo)}!`);
        else embed.setDescription(`${username} played **${friendlyDuration(value)}** in total ${agoString.days(daysAgo)}!`);

        message.reply(embed);
    }
};