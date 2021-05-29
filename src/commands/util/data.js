const { Command } = require('discord.js-commando');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class rawData extends Command {
    constructor(client) {
        super(client, {
            name: 'rawdata',
            aliases: ['data', 'export'],
            group: 'util',
            memberName: 'data',
            description: 'Get all data associated with a player, in JSON form.',
            examples: ['rawdata', 'rawdata citrus_melon', 'rawdata @citrus-melon'],
            throttling: {duration: 10, usages: 5},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'Who would you like to get the data of? Enter a Minecraft username or mention a Discord user.',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account);
        if (typeof player === 'string') return message.reply(player);
        
        return message.reply('**Raw data for ' + await usernameCache.getUsernameByID(player._id) + ':**```json\n' + JSON.stringify(player, null, 2) + '```');
    }
};