const {Command} = require('discord.js-commando');
const playerData = require('../../playerData');
const usernameCache = require('../../usernameCache');

const OPTIONS = {projection: {'_id': 1}}

module.exports = class ClassName extends Command {
    constructor(client) {
        super(client, {
            name: 'deletedata',
            group: 'account',
            memberName: 'delete',
            description: '*PERMANANTLY* delete all data associated with a player.',
            examples: ['deletedata citrus_melon', 'deletedata @citrus-melon'],
            userPermissions: ['ADMINISTRATOR'],
            throttling: {duration: 20, usages: 1},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'What player would you like to delete data from? Enter a Minecraft username or mention a Discord user.',
                    type: 'mention|minecraftaccount'
                }
            ]
        })
    }

    async run(message, { account }) {
        let result;
        if (typeof account === 'string') { // It is a Minecraft ID
            result = (await playerData.findOneAndDelete({'_id': account}, OPTIONS)).value;
            if (!result) return message.reply(`The player \`${await usernameCache.getUsernameByID(account)}\` does not have any associated data!`);
        } else { // It is a Discord user
            result = (await playerData.findOneAndDelete({'discordID': account.id}, OPTIONS)).value;
            if (!result) return message.reply(`\`${account.tag}\` does not have a linked Minecraft account!`);
        }
        message.reply(`The data associated with the player \`${await usernameCache.getUsernameByID(result._id)}\` has been permanantly deleted!`);
    }
}