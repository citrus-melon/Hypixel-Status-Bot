const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class todayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'daysago',
            group: 'time',
            memberName: 'daysago',
            description: 'Get a player\'s total tracked playtime on a specific day, up to 29 days ago',
            examples: ['daysago 3', 'daysago 3 citrus_melon', 'daysago 3 @citrus-melon'],
            throttling: {duration: 10, usages: 5},
            args: [
                {
                    key: 'daysAgo',
                    type: 'integer',
                    label: 'number of days ago',
                    max: 29,
                    min: 1,
                    prompt: 'How many days ago is the day you would like to get? (Ex. yesterday = 1)'
                },
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
    async run(message, { account, daysAgo }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account);
        if (typeof player === 'string') {
            message.reply(player);
            return;
        }

        const adjustedPlayer = playerHelpers.tryChangeDays(player, new Date());
        const username = await usernameCache.getUsernameByID(player.mcID);
        const value = adjustedPlayer.dailyHistory[29-daysAgo];
        
        const embed = new MessageEmbed();
        embed.setAuthor(username, `https://crafatar.com/avatars/${player.mcID}`, `https://namemc.com/profile/${player.mcID}`);
        embed.setTitle(`${username}'s playtime today`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);

        if (value === null) embed.setDescription(`${username} wasn't tracked ${daysAgo} days ago!`);
        else embed.setDescription(`${username} played **${friendlyDuration(value)}** in total ${daysAgo} days ago!`);

        message.embed(embed);
    }
};