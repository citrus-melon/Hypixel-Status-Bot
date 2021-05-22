const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/daily');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class ThirtyDayChart extends Command {
    constructor(client) {
        super(client, {
            name: '30daychart',
            aliases: ['monthchart'],
            group: 'charts',
            memberName: '30day',
            description: 'Get one or more players\' playtime for the past 30 days, as a chart',
            examples: ['30daychart', '30daychart citrus_melon', '30daychart @citrus-melon'],
            throttling: {duration: 10, usages: 3},
            args: [
                {
                    key: 'accounts',
                    label: 'player',
                    prompt: 'Whoose stats would you like to get? Enter a Minecraft username or mention a Discord user',
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