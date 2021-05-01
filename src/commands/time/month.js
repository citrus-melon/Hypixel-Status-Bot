const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');
const friendlyDuration = require('../../helpers/friendlyDuration');

module.exports = class thisMonthPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'monthtotal',
            group: 'time',
            memberName: 'month',
            description: 'Get a player\'s total tracked playtime of a player this month',
            examples: ['monthtotal', 'monthtotal citrus_melon', 'monthtotal @citrus-melon'],
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
        const username = await usernameCache.getUsernameByID(player.mcID);
        const value = adjustedPlayer.monthlyHistory[adjustedPlayer.monthlyHistory.length-1];
        const embed = new MessageEmbed();

        embed.setDescription(`${username} has played for **${friendlyDuration(value)}** in total this month!`);

        embed.setAuthor(username, `https://crafatar.com/avatars/${player.mcID}`, `https://namemc.com/profile/${player.mcID}`);
        embed.setTitle(`${username}'s total playtime by weekday`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        message.embed(embed);
    }
};