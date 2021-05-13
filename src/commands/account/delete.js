const {Command} = require('discord.js-commando');
const playerData = require('../../playerData');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class ClassName extends Command {
    constructor(client) {
        super(client, {
            name: 'deletedata',
            group: 'account',
            memberName: 'delete',
            description: 'PERMANANTLY delete all data associated with a player',
            examples: ['deletedata citrus_melon', 'deletedata @citrus-melon'],
            userPermissions: ['ADMINISTRATOR'],
            throttling: {duration: 20, usages: 1},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'What player would you like to delete data from? Enter a Minecraft username or mention a Discord user',
                    type: 'mention|minecraftaccount'
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

        await playerData.remove(player.mcID);
        message.reply(`The data associated with the player \`${await usernameCache.getUsernameByID(player.mcID)}\` has been permanantly deleted!`)
    }
}