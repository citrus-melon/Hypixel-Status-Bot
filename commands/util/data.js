const { Command } = require('discord.js-commando');
const playerHelpers = require('../../playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class rawData extends Command {
    constructor(client) {
        super(client, {
            name: 'rawdata',
            group: 'util',
            memberName: 'data',
            description: 'Get all data associated with an account, in json form',
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
        
        message.reply('Raw data for ' + await usernameCache.getUsernameByID(player.mcID) + ':```json\n' + JSON.stringify(player, null, 2) + '```');
    }
};