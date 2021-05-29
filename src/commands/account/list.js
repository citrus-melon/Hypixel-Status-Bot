const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const playerData = require('../../playerData');
const usernameCache = require('../../usernameCache');

module.exports = class listPlayers extends Command {
    constructor(client) {
        super(client, {
            name: 'list',
            aliases: ['fl', 'listonline'],
            group: 'account',
            memberName: 'list',
            description: 'List the current online players.',
            examples: ['list'],
            throttling: {duration: 10, usages: 2}
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message) {
        let response = '**__All tracked players currently online:__**';

        const players = await playerData.findMultiple({"online":true})
            .project({_id:1});
        for await (const player of players) {
            const username = await usernameCache.getUsernameByID(player._id);
            response += `\n**${username}** is online`
        }

        const embed = new MessageEmbed();
        embed.setTitle('Online Players');
        embed.setDescription(response);
        embed.setFooter('(Updated every 30 seconds)')
        return message.reply(embed);
    }
};