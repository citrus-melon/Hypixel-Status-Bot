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
            description: 'Get a player\'s monthly playtime, as a chart',
            examples: ['monthlychart', 'monthlychart citrus_melon', 'monthlychart @citrus-melon'],
            throttling: {duration: 10, usages: 3},
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
        const player = await playerHelpers.getDiscordOrMinecraft(account, {monthlyHistory: 1, lastIncremented: 1});
        if (typeof player === 'string') { message.reply(player); return; }

        const adjustedHistory = playerHelpers.adjustMonthlyHistory(player.monthlyHistory, player.lastIncremented, new Date());
        const username = await usernameCache.getUsernameByID(player._id);

        const chart = new Chart(adjustedHistory, username);
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `monthly_playtime.png`);
        message.reply(attachment);
    }
};