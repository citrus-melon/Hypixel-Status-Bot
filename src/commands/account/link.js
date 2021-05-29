const { Command } = require('discord.js-commando');
const playerData = require('../../playerData');
const Player = require('../../player');
const usernameCache = require('../../usernameCache');

module.exports = class linkPlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'link',
            group: 'account',
            memberName: 'link',
            description: 'Link a Minecraft account to a Discord account.',
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
        if (discordAccount !== message.author && !message.member.hasPermission('MANAGE_NICKNAMES')) {
            message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
            return;
        }

        const blankValues = new Player();
        delete blankValues._id;
        delete blankValues.discordID;

        try {
            await playerData.updateOne(
                { _id: mcAccount, discordID: null },
                { $set: { 'discordID': discordAccount.id }, $setOnInsert: blankValues },
                { upsert: true }
            )
            message.reply(`Sucessfully linked ${discordAccount.tag} to ${await usernameCache.getUsernameByID(mcAccount)}!`)
        } catch (err) {
            if (err.code === 11000 && err.keyPattern.discordID) {
                message.reply('You already have a linked Minecraft account!');
            } else if (err.code === 11000 && err.keyPattern._id) {
                message.reply('That Minecraft account is already linked to a Discord member!');
            } else throw err;
        }
    }
};