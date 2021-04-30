const { Command } = require('discord.js-commando');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class lifetimePlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'lifetime',
            group: 'time',
            memberName: 'life',
            description: 'Get a player\'s total lifetime tracked playtime',
            examples: ['lifetime', 'lifetime citrus_melon', 'lifetime @citrus-melon'],
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
    
        let sum = 0;
        for (const day of player.dailyTotals) {
            sum += day;
        }
    
        message.reply(`${await usernameCache.getUsernameByID(player.mcID)} has played **${sum} minutes** in total while tracked!`);
    }
};