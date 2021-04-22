const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');

module.exports = class todayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'stats',
            memberName: 'today',
            description: 'Get a player\'s total tracked playtime today, since midnight',
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
        
        message.reply(`Today you has played for ${adjustedPlayer.dailyHistory[adjustedPlayer.dailyHistory.length-1]} minutes`);
    }
};