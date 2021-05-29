const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/monthly');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class MonthlyChart extends Command {
    constructor(client) {
        super(client, {
            name: 'monthlychart',
            group: 'charts',
            memberName: 'monthly',
            description: 'Get one or more players\' monthly playtime, as a chart',
            examples: ['monthlychart', 'monthlychart citrus_melon', 'monthlychart @citrus-melon'],
            throttling: {duration: 10, usages: 3},
            args: [
                {
                    key: 'accounts',
                    label: 'player(s)',
                    prompt: 'Whoose stats would you like to graph? Enter Minecraft usernames or mention Discord users.',
                    type: 'mention|minecraftaccount',
                    infinite: true,
                    default: message => [message.author]
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { accounts }) {
        if (accounts.length > 10) return message.reply('Please enter less than 10 players!');

        const chartDatasets = [];
        for (const account of accounts) {
            const player = await playerHelpers.getDiscordOrMinecraft(account, {monthlyHistory: 1, lastIncremented: 1});
            if (typeof player === 'string') { message.reply(player); return; }

            chartDatasets.push({
                adjustedHistory: playerHelpers.adjustMonthlyHistory(player.monthlyHistory, player.lastIncremented, new Date()),
                username: await usernameCache.getUsernameByID(player._id)
            })
        }

        const chart = new Chart(chartDatasets);
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `monthly_playtime.png`);
        message.reply(attachment);
    }
};