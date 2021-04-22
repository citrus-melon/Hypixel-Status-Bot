const {Command} = require('discord.js-commando');
const dataManager = require('../../dataManager');
const playerHelpers = require('../../playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class ClassName extends Command {
    constructor(client) {
        super(client, {
            name: 'deletedata',
            group: 'account',
            memberName: 'delete',
            description: 'PERMANANTLY delete all data associated with a Minecraft account',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'account',
                    prompt: 'What is the Minecraft username or discord member you would like to clear data from?',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                }
            ]
        })
    }

    async run(message, { account }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account);
        if (typeof player === 'string') {
            message.reply(player);
            return;
        }

        await dataManager.remove(player.mcID);
        message.reply(`The data associated with the Minecraft account \`${await usernameCache.getUsernameByID(player.mcID)}\` has been permanantly deleted!`)
    }
}