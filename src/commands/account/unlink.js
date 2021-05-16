const { Command } = require('discord.js-commando');
const playerData = require('../../playerData');
const usernameCache = require('../../usernameCache');

const UPDATE = {$set: {discordID: null}};
const PROJECTION = {projection: {'_id': 1, 'discordID': 1}};

module.exports = class unlinkPlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'unlink',
            group: 'account',
            memberName: 'unlink',
            description: 'Unlink a Minecraft account from a Discord account',
            examples: ['unlink', 'unlink @citrus-melon'],
            throttling: {duration: 180, usages: 1},
            args: [
                {
                    key: 'account',
                    name: 'player',
                    prompt: 'What player would you like to unlink?',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                },
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account }) {
        if (account !== message.author && !message.member.hasPermission('MANAGE_NICKNAMES')) {
            message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
            return;
        }
    
        let result;
        if (typeof account === 'string') { // It is a Minecraft ID
            result = (await playerData.findOneAndUpdate({'_id': account, 'discordID': {$ne: null}}, UPDATE, PROJECTION)).value;
            if (!result) return message.reply(`The player \`${await usernameCache.getUsernameByID(account)}\` does not have a linked Discord user!`);
        } else { // It is a Discord user
            result = (await playerData.findOneAndUpdate({'discordID': account.id}, UPDATE, PROJECTION)).value;
            if (!result) return message.reply(`\`${account.tag}\` does not have a linked Minecraft account!`);
        }
        const discordTag = this.client.users.cache.get(result.discordID).tag;
        message.reply(`Sucessfully unlinked \`${await usernameCache.getUsernameByID(result._id)}\` from \`${discordTag}\`!`);
    }
};