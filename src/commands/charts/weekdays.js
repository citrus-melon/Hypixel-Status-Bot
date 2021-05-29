const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/weekdays');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class weekdayTotalsChart extends Command {
    constructor(client) {
        super(client, {
            name: 'weekdayschart',
            aliases: ['weekdaychart'],
            group: 'charts',
            memberName: 'weekdays',
            description: 'Graph a player\'s total playtime by weekday.',
            examples: ['weekdayschart', 'weekdayschart citrus_melon', 'weekdayschart @citrus-melon'],
            throttling: {duration: 10, usages: 3},
            args: [
                {
                    key: 'account',
                    label: 'player',
                    prompt: 'Whoose stats would you like to graph? Enter a Minecraft username or mention a Discord user.',
                    type: 'mention|minecraftaccount',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { account }) {
        const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyTotals: 1, lastIncremented: 1});
        if (typeof player === 'string') return message.reply(player);

        const username = await usernameCache.getUsernameByID(player._id);

        const chart = new Chart(player.dailyTotals, username);
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `weekday_playtime.png`);
        return message.reply(attachment);
    }
};