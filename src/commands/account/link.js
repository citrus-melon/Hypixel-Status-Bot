const { Command } = require('discord.js-commando');
const playerData = require('../../playerData');
const Player = require('../../player');
const usernameCache = require('../../usernameCache');

module.exports = class linkPlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'link',
            aliases: ['track', 'add'],
            group: 'account',
            memberName: 'link',
            description: 'Link a Minecraft account to a Discord account.',
            details: 'Server members with `Manage Nicknames` permission can link other players',
            examples: ['link citrus_melon', 'link citrus_melon @citrus-melon'],
            throttling: {duration: 180, usages: 1},
            args: [
                {
                    key: 'mcAccount',
                    label: 'Minecraft username',
                    prompt: 'What is the username of the Minecraft account you would like to link?',
                    type: 'minecraftaccount',
                },
                {
                    key: 'discordAccount',
                    label: 'Discord account',
                    prompt: 'Which Discord user would you like to link this account to?',
                    type: 'user',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { discordAccount, mcAccount }) {
        if (discordAccount !== message.author && (!message.member || !message.member.hasPermission('MANAGE_NICKNAMES'))) {
            return message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
        }

        const mcUsername = await usernameCache.getUsernameByID(mcAccount);

        const blankValues = new Player();
        delete blankValues._id;
        delete blankValues.discordID;

        try {
            await playerData.updateOne(
                { _id: mcAccount, discordID: null },
                { $set: { 'discordID': discordAccount.id }, $setOnInsert: blankValues },
                { upsert: true }
            )
            return message.reply(`Sucessfully linked ${discordAccount.tag} to ${mcUsername}!`)
        } catch (err) {
            if (err.code === 11000 && err.keyPattern.discordID) {
                return message.reply(`\`${discordAccount.tag}\` already has a linked Minecraft account!`);
            } else if (err.code === 11000 && err.keyPattern._id) {
                return message.reply(`\`${mcUsername}\` is already linked to a Discord user!`);
            } else throw err;
        }
    }
};