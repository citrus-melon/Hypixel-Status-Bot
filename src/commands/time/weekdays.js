const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const friendlyDuration = require('../../helpers/friendlyDuration');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = class lifetimePlaytime extends Command {
    constructor(client) {
        super(client, {
            name: 'weekdays',
            group: 'time',
            memberName: 'weekdays',
            description: 'Get a player\'s total playtime per weekday',
            examples: ['weekdays', 'weekdays citrus_melon', 'weekdays @citrus-melon'],
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

        const username = await usernameCache.getUsernameByID(player._id);
        const embed = new MessageEmbed();
        let sum = 0;

        for (let index = 0; index < player.dailyTotals.length; index++) {
            const value = player.dailyTotals[index];
            sum += value;
            embed.addField(WEEKDAY_NAMES[index] + 's', friendlyDuration(value));
        }

        embed.addField('Total', friendlyDuration(sum));

        embed.setAuthor(username, `https://crafatar.com/avatars/${player._id}`, `https://namemc.com/profile/${player._id}`);
        embed.setTitle(`${username}'s total playtime by weekday`);
        embed.setFooter('(Only while tracked)');
        embed.setTimestamp(player.lastIncremented);
        message.embed(embed);
    }
};