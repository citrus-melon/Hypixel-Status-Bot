const { Command } = require('discord.js-commando');
const dataManager = require('../../dataManager');

module.exports = class lifetimePlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'lifetime',
            group: 'stats',
            memberName: 'lifetime',
            description: 'Get total playtime from all time that this user was tracked',
            args: [
                {
                    key: 'target',
                    prompt: 'Whoose stats would you like to get?',
                    type: 'user',
                    default: message => message.author
                },
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { target }) {
        const discordID = target.id;

        const player = await dataManager.getByDiscord(discordID);
    
        if (!player) {
            message.reply(`${target.tag} doesn't have a linked Minecraft account!`);
            return;
        }
    
        let sum = 0;
        for (const day of player.dailyTotals) {
            sum += day;
        }
    
        message.reply(`You have played a total of ${sum} minutes while tracked!`);
    }
};