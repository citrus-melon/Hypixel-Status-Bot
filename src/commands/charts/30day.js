const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/daily');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class thirtyDayChart extends Command {
    constructor(client) {
        super(client, {
            name: '30daychart',
            aliases: ['monthchart'],
            group: 'charts',
            memberName: '30day',
            description: 'Graph one or more players\' playtime for the past 30 days, as a chart.',
            details: 'The specified day can be up to 29 days ago. For example, 1 day ago is yesterday.',
            examples: ['30daychart', '30daychart citrus_melon', '30daychart @citrus-melon'],
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
            const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyHistory: 1, lastIncremented: 1});
            if (typeof player === 'string') { message.reply(player); return; }

            chartDatasets.push({
                history: playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date()),
                username: await usernameCache.getUsernameByID(player._id)
            })
        }

        const chart = new Chart(chartDatasets, '30 Day Playtime History');
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `thirty_day_playtime.png`);
        message.reply(attachment);
    }
};