const { Command } = require('discord.js-commando');
const dataManager = require('../../dataManager');
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

        let player = await dataManager.getByDiscord(discordID);
    
        if (!player) {
            message.reply(`${target.tag} doesn't have a linked Minecraft account!`);
            return;
        }
        player = playerHelpers.tryChangeDays(player, new Date());
        
        message.reply(`this month you/they have played for ${player.monthlyHistory[player.monthlyHistory.length-1]} minutes!`);
    }
};