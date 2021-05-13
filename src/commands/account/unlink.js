const { Command } = require('discord.js-commando');
const playerData = require('../../playerData');
const usernameCache = require('../../usernameCache');

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
                    key: 'discordAccount',
                    name: 'Discord account',
                    prompt: 'Which Discord user would you like to unlink?',
                    type: 'user',
                    default: message => message.author
                },
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { discordAccount }) {
        if (discordAccount !== message.author && !message.member.hasPermission('MANAGE_NICKNAMES')) {
            message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
            return;
        }

        const player = await playerData.getByDiscord(discordAccount.id);
    
        if (!player) {
            message.reply(`${discordAccount.tag} does not have a linked account!`);
            return;
        }
    
        player.discordID = null;
        playerData.set(player._id, player);
        message.reply(`Sucessfully unlinked ${await usernameCache.getUsernameByID(player._id)} from ${discordAccount.tag}!`)
    }
};