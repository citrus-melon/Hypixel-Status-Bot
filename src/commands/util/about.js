const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { version, repository } = require('../../../package.json');

module.exports = class about extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            aliases: ['credits', 'info'],
            group: 'util',
            memberName: 'about',
            description: 'Info about the bot and credits',
            examples: ['about']
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message) {
        const embed = new MessageEmbed();
        embed.setTitle('Hypixel Status Bot');
        embed.setAuthor('Created with ❤ by Citrus-Melon', 'https://citrus-melon.github.io/images/logo.png', 'https://citrus-melon.github.io/');
        embed.setThumbnail(this.client.user.displayAvatarURL());
        embed.setDescription('A Discord bot that tracks players\' online status on the Hypixel Minecraft server to provide notifications and statistics :)');
        embed.addField('Version', version, true);
        embed.addField('Source Code', `[Link](${repository.url})`, true);
        embed.addField('Help', 'To view the list of commands, use`' + this.client.commandPrefix + 'help`.');
        return message.reply(embed);
    }
};