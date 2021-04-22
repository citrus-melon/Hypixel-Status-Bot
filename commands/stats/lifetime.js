const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');

module.exports = class lifetimePlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'lifetime',
            group: 'stats',
            memberName: 'lifetime',
            description: 'Get total playtime from all time that this user was tracked',
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
    
        let sum = 0;
        for (const day of player.dailyTotals) {
            sum += day;
        }
    
        message.reply(`You have played a total of ${sum} minutes while tracked!`);
    }
};