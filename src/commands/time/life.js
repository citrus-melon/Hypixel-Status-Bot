const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');
const friendlyDuration = require('../../helpers/friendlyDuration');

module.exports = class lifetimePlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'lifetime',
            group: 'time',
            memberName: 'life',
            description: 'Get a player\'s total lifetime tracked playtime',
            examples: ['lifetime', 'lifetime citrus_melon', 'lifetime @citrus-melon'],
            throttling: {duration: 10, usages: 5},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'Whoose stats would you like to get? Enter a Minecraft username or mention a Discord user',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account);
        if (typeof player === 'string') {
            message.reply(player);
            return;
        }
    
        let sum = 0;
        for (const day of player.dailyTotals) sum += day;
    
        const username = await usernameCache.getUsernameByID(player.mcID);

        const embed = new MessageEmbed();
        embed.setAuthor(username, `https://crafatar.com/avatars/${player.mcID}`, `https://namemc.com/profile/${player.mcID}`);
        embed.setTitle(`${username}'s lifetime playtime`);
        embed.setDescription(`${username} has played for **${friendlyDuration(sum)}** in total!`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        message.embed(embed);
    }
};