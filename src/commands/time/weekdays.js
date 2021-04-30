const { Command } = require('discord.js-commando');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class lifetimePlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'weekdays',
            group: 'time',
            memberName: 'weekdays',
            description: 'Get a player\'s total playtime per weekday',
            examples: ['weekdays', 'weekdays citrus_melon', 'weekdays @citrus-melon'],
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
        for (const day of player.dailyTotals) sum += day;
    
        message.reply(
`**Total playtime by weekday for ${await usernameCache.getUsernameByID(player.mcID)}:**
Sundays: **${player.dailyTotals[0]}**
Mondays: **${player.dailyTotals[1]}**
Tuesdays: **${player.dailyTotals[2]}**
Wednesdays: **${player.dailyTotals[3]}**
Thursdays: **${player.dailyTotals[4]}**
Fridays: **${player.dailyTotals[5]}**
Saturdays: **${player.dailyTotals[6]}**
Total: **${sum}**`
        );
    }
};