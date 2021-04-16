const { Command } = require('discord.js-commando');
const dataManager = require('../../dataManager');

module.exports = class rawData extends Command {
    constructor(client) {
        super(client, {
            name: 'rawdata',
            group: 'util',
            memberName: 'rawdata',
            description: 'Get all data associated with an account, in json form',
            args: [
                {
                    key: 'target',
                    prompt: 'Whoose data would you like to get?',
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
        message.reply('Raw data for ' + target.tag + ':```json\n' + JSON.stringify(player, null, 2) + '\n```');
    }
};