const { Command } = require('discord.js-commando');
const dataManager = require('../../dataManager');

module.exports = class todayPlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'stats',
            memberName: 'today',
            description: 'Get total playtime since midnight for the current day',
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

        const player = await dataManager.getPlayerByDiscord(discordID);
        await dataManager.tryChangeDays(player, new Date());
    
        if (!player) {
            message.reply(`${target.tag} doesn't have a linked Minecraft account!`);
            return;
        }
        message.reply(`Today you/they have played for ${player.dailyHistory[player.dailyHistory.length-1]} minutes`);
    }
};