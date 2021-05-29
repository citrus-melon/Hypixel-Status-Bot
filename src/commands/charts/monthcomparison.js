const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/comparison');
const { months } = require('../../helpers/agoString');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class monthComparison extends Command {
    constructor(client) {
        super(client, {
            name: 'monthcomparison',
            aliases: ['comparemonth', 'comparemonthchart','monthcomparisonchart', 'monthcomapare', 'cm'],
            group: 'charts',
            memberName: 'monthcomparison',
            description: 'Compare the playtime of multiple players during a certain month.',
            examples: ['monthcomparison 1 @citrus_melon yambots'],
            throttling: {duration: 10, usages: 3},
            args: [
                {
                    key: 'monthsAgo',
                    type: 'integer',
                    label: 'number of months ago',
                    max: 29,
                    min: 0,
                    default: 0,
                    prompt: 'How many months ago is the month you would like to get? (Ex. last month = 1)'
                },
                {
                    key: 'accounts',
                    label: 'players',
                    prompt: 'Whoose stats would you like to compare? Enter Minecraft usernames or mention Discord users.',
                    type: 'mention|minecraftaccount',
                    infinite: true
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { accounts, monthsAgo }) {
        if (accounts.length < 2 || accounts.length > 10) return message.reply('Please enter between 2-10 players!');

        const players = [];
        const usernames = [];

        for (const account of accounts) {
            const player = await playerHelpers.getDiscordOrMinecraft(account, {monthlyHistory: 1, lastIncremented: 1});
            if (typeof player === 'string') return message.reply(player);
            const adjustedHistory = playerHelpers.adjustMonthlyHistory(player.monthlyHistory, player.lastIncremented, new Date());
            players.push(adjustedHistory[monthsAgo]);
            usernames.push(await usernameCache.getUsernameByID(player._id));
        }

        const chart = new Chart(players, usernames, `${months(monthsAgo, true)} Playtime Comparison`);
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `month_comparison.png`);
        return message.reply(attachment);
    }
};