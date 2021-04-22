const { Command } = require('discord.js-commando');
const dataManager = require('../../dataManager');
const usernameCache = require('../../usernameCache');

module.exports = class linkPlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'link',
            group: 'account',
            memberName: 'link',
            description: 'Link a minecraft account to a discord account',
            args: [
                {
                    key: 'mcName',
                    prompt: 'What is your Minecraft username?',
                    type: 'minecraftaccount',
                },
                {
                    key: 'member',
                    prompt: 'Which discord account would you like to link this account to?',
                    type: 'user',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { member, mcName }) {
        if (member !== message.author && !message.member.hasPermission('MANAGE_NICKNAMES')) {
            message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
            return;
        }

        const discordID = member.id;

        let player = await dataManager.getByMinecraft(mcName);
        if (!player) player = new dataManager.Player(mcName, discordID);

        else if (!player.discordID) player.discordID = discordID;

        else {
            if (player.discordID !== discordID) message.reply('That account has already been linked by someone else!');
            else message.reply('Those accounts are already linked!');
            return;
        }

        await dataManager.set(mcName, player);
        message.reply(`sucessfully linked ${member.tag} to ${await usernameCache.getUsernameByID(mcName)}!`)
    }
};