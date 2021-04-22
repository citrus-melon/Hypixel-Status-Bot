const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');

module.exports = class thisMonthPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'monthtotal',
            group: 'stats',
            memberName: 'month',
            description: 'Get a player\'s total tracked playtime of a player this month',
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
        
        message.reply(`this month you/they have played for ${adjustedPlayer.monthlyHistory[adjustedPlayer.monthlyHistory.length-1]} minutes!`);
    }
};