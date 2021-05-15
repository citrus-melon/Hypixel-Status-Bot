const { Command } = require('discord.js-commando');
const playerData = require('../../playerData');
const usernameCache = require('../../usernameCache');

module.exports = class listPlayers extends Command {
    constructor(client) {
        super(client, {
            name: 'list',
            group: 'util',
            memberName: 'list',
            description: 'List the current online players',
            examples: ['list'],
            throttling: {duration: 10, usages: 2}
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message) {
        let response = '**__All tracked players currently online:__**';

        const players = await playerData.getAll();
        for (const player of players) {
            if(!player.online) continue;
            const username = await usernameCache.getUsernameByID(player._id);
            response += `\n**${username}** is online`
        }

        response += `\n\nGame, mode, and map status coming "soon" (I'm lazy)!`

        message.reply(response);
    }
};