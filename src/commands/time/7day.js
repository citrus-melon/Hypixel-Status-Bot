const { Command } = require('discord.js-commando');
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
        const player = await playerHelpers.getDiscordOrMinecraft(account);
        if (typeof player === 'string') {
            message.reply(player);
            return;
        }

        const adjustedPlayer = playerHelpers.tryChangeDays(player, new Date());
        
        let response = `**Playtime in the past 7 days for ${await usernameCache.getUsernameByID(player.mcID)}:**`;
        response += `\n**Today:** ${adjustedPlayer.dailyHistory[29]} minutes`;
        let total = adjustedPlayer.dailyHistory[29];
        for (let daysAgo = 1; daysAgo < 7; daysAgo++) {
            const value = adjustedPlayer.dailyHistory[29-daysAgo];
            response += '\n';
            if (value === null) response += `**${daysAgo} days ago:** *The player was not tracked!*`
            else response += `**${daysAgo} days ago:** ${value} minutes`;
            total += value;
        }
        response += `\n**Total:** ${total}`;

        message.reply(response);
    }
};