const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/comparison');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class WeekmonthTotalsChart extends Command {
    constructor(client) {
        super(client, {
            name: 'monthcomparison',
            aliases: ['comparemonthchart', 'comparemonth', 'monthcomparisonchart', 'monthcompare'],
            group: 'charts',
            memberName: 'monthcomparision',
            description: 'Compare the playtime of multiple players during a certain month',
            examples: ['comparemonth', 'comparemonth citrus_melon', 'comparemonth @citrus-melon'],
            throttling: {duration: 10, usages: 3},
            args: [
                {
                    key: 'monthsAgo',
                    type: 'integer',
                    label: 'number of months ago',
                    max: 29,
                    min: 0,
                    default: 0,
                    prompt: 'How many months ago is the month you would like to get? (Ex. yestermonth = 1)'
                },
                {
                    key: 'accounts',
                    label: 'players',
                    prompt: 'Please enter the players you would like to compare using Minecraft usernames or mention a Discord users.',
                    type: 'mention|minecraftaccount',
                    infinite: true
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { accounts, monthsAgo }) {
        const players = [];
        const usernames = [];

        for (const account of accounts) {
            const player = await playerHelpers.getDiscordOrMinecraft(account, {monthlyHistory: 1, lastIncremented: 1});
            if (typeof player === 'string') return message.reply(player);
            const adjustedHistory = playerHelpers.adjustMonthlyHistory(player.monthlyHistory, player.lastIncremented, new Date());
            players.push(adjustedHistory[monthsAgo]);
            usernames.push(await usernameCache.getUsernameByID(player._id));
        }

        const chart = new Chart(players, usernames, `${monthsAgo} Months Ago Playtime Comparison`);
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `month_comparision.png`);
        message.reply(attachment);
    }
};