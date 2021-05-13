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
            description: 'Link a Minecraft account to a Discord account',
            examples: ['link citrus_melon', 'link citrus_melon @citrus-melon'],
            throttling: {duration: 180, usages: 1},
            args: [
                {
                    key: 'mcAccount',
                    label: 'Minecraft Username',
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

        const discordID = discordAccount.id;

        if (await playerData.getByDiscord(discordID)) {
            message.reply('You already have a linked Minecraft account!');
            return;
        }

        let player = await playerData.getByMinecraft(mcAccount);
        if (!player) player = new Player(mcAccount, discordID);

        else if (!player.discordID) player.discordID = discordID;

        else {
            if (player.discordID !== discordID) message.reply('That Minecraft account has already been linked by someone else!');
            else message.reply('Those accounts are already linked!');
            return;
        }

        await playerData.set(mcAccount, player);
        message.reply(`Sucessfully linked ${discordAccount.tag} to ${await usernameCache.getUsernameByID(mcAccount)}!`)
    }
};