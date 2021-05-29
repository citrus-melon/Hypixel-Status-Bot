const {Command} = require('discord.js-commando');
const playerData = require('../../playerData');
const usernameCache = require('../../usernameCache');

const OPTIONS = {projection: {'_id': 1}}

module.exports = class deleteData extends Command {
    constructor(client) {
        super(client, {
            name: 'deletedata',
            group: 'account',
            memberName: 'delete',
            description: '*PERMANENTLY* delete all data associated with a player.',
            examples: ['deletedata citrus_melon', 'deletedata @citrus-melon'],
            userPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
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
        message.reply('Are you sure? Type `I understand this is permanent` to contine.');
        const confirmationFilter = m => m.author === message.author;
        const response = (await message.channel.awaitMessages(confirmationFilter, { max: 1, time: 20000})).first();
        if (!response || response.content !== 'I understand this is permanent') return response.reply('Data deletion was canceled');

        let result;
        if (typeof account === 'string') { // It is a Minecraft ID
            result = (await playerData.findOneAndDelete({'_id': account}, OPTIONS)).value;
            if (!result) return message.reply(`The player \`${await usernameCache.getUsernameByID(account)}\` does not have any associated data!`);
        } else { // It is a Discord user
            result = (await playerData.findOneAndDelete({'discordID': account.id}, OPTIONS)).value;
            if (!result) return message.reply(`\`${account.tag}\` does not have a linked Minecraft account!`);
        }
        return message.reply(`The data associated with the player \`${await usernameCache.getUsernameByID(result._id)}\` has been permanantly deleted!`);
    }
}