const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');

module.exports = class thisMonthPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'monthtotal',
            group: 'stats',
            memberName: 'monthtotal',
            description: 'Get total playtime for the current month',
            args: [
                {
                    key: 'account',
                    prompt: 'What is the Minecraft username or discord account of the player?',
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