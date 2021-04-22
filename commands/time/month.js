const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class thisMonthPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'monthtotal',
            group: 'stats',
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
        
        message.reply(`${await usernameCache.getUsernameByID(player.mcID)} has played *${sum} minutes* in total this month!`);
    }
};