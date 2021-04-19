const { Command } = require('discord.js-commando');
const dataManager = require('../../dataManager');

module.exports = class unlinkPlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'unlink',
            group: 'account',
            memberName: 'unlink',
            description: 'Unlink a minecraft account from a discord account',
            args: [
                {
                    key: 'target',
                    prompt: 'Who would you like to unlink?',
                    type: 'user',
                    default: message => message.author
                },
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { target }) {
        const discordID = target.id;

        const player = await dataManager.getByDiscord(discordID);
    
        if (!player) {
            message.reply(`${target.tag} does not have a linked account!`);
            return;
        }

        if (target != message.author && !message.member.hasPermission('MANAGE_NICKNAMES')) {
            message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
            return;
        }
    
        dataManager.remove(player.mcID);
        message.reply(`Sucessfully unlinked ${target.tag}!`)
    }
};