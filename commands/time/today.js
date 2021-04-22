const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');

module.exports = class todayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'stats',
            memberName: 'today',
            description: 'Get total playtime since midnight for the current day',
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
        
        message.reply(`Today you has played for ${adjustedPlayer.dailyHistory[adjustedPlayer.dailyHistory.length-1]} minutes`);
    }
};