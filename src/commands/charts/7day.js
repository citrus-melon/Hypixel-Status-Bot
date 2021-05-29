const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/daily');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class sevenDayChart extends Command {
    constructor(client) {
        super(client, {
            name: '7daychart',
            aliases: ['pastweekchart', 'weekchart', 'past7dayschart', 'p7dc', '7dc', 'wc', 'pwc'],
            group: 'charts',
            memberName: '7day',
            description: 'Graph one or more players\' playtime for the past 7 days.',
            examples: ['7daychart', '7daychart citrus_melon', '7daychart @citrus-melon'],
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
            if (typeof player === 'string') return message.reply(player);

            const adjustedHistory = playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date());
            chartDatasets.push({
                history: adjustedHistory.slice(0, 7),
                username: await usernameCache.getUsernameByID(player._id)
            })
        }

        const chart = new Chart(chartDatasets, '7 Day Playtime History');
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `seven_day_playtime.png`);
        return message.reply(attachment);
    }
};