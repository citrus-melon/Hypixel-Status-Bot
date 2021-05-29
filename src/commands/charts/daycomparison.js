const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/comparison');
const agoString = require('../../helpers/agoString');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class dayComparision extends Command {
    constructor(client) {
        super(client, {
            name: 'daycomparison',
            aliases: ['compareday', 'comparedaychart', 'daycomparsionchart', 'daycompare', 'cd'],
            group: 'charts',
            memberName: 'daycomparision',
            description: 'Compare the playtime of multiple players on a certain day.',
            examples: ['compareday', 'compareday citrus_melon', 'compareday @citrus-melon'],
            throttling: {duration: 10, usages: 3},
            args: [
                {
                    key: 'daysAgo',
                    type: 'integer',
                    label: 'number of days ago',
                    max: 29,
                    min: 0,
                    default: 0,
                    prompt: 'How many days ago is the day you would like to get? (Ex. yesterday = 1)'
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
    async run(message, { accounts, daysAgo }) {
        if (accounts.length < 2 || accounts.length > 10) return message.reply('Please enter between 2-10 players!');

        const players = [];
        const usernames = [];

        for (const account of accounts) {
            const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyHistory: 1, lastIncremented: 1});
            if (typeof player === 'string') return message.reply(player);
            const adjustedHistory = playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date());
            players.push(adjustedHistory[daysAgo]);
            usernames.push(await usernameCache.getUsernameByID(player._id));
        }

        const chart = new Chart(players, usernames, `${agoString.days(daysAgo, true)} Playtime Comparison`);
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `day_comparision.png`);
        return message.reply(attachment);
    }
};