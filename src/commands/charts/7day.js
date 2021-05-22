const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/daily');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class SevenDayChart extends Command {
    constructor(client) {
        super(client, {
            name: '7daychart',
            aliases: ['weekchart'],
            group: 'charts',
            memberName: '7day',
            description: 'Get one or more players\' playtime for the past 7 days, as a chart',
            examples: ['7daychart', '7daychart citrus_melon', '7daychart @citrus-melon'],
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
        const chartDatasets = [];
        for (const account of accounts) {
            const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyHistory: 1, lastIncremented: 1});
            if (typeof player === 'string') { message.reply(player); return; }

            const adjustedHistory = playerHelpers.adjustDailyHistory(player.dailyHistory, player.lastIncremented, new Date());
            chartDatas.push({
                history: adjustedHistory.slice(0, 7),
                username: await usernameCache.getUsernameByID(player._id)
            })
        }

        const chart = new Chart(chartDatasets, '7 Day Playtime History');
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `seven_day_playtime.png`);
        message.reply(attachment);
    }
};