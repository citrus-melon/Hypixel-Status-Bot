const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/comparison');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class WeeklifeTotalsChart extends Command {
    constructor(client) {
        super(client, {
            name: 'lifecomparison',
            aliases: ['comparelifechart', 'comparelife', 'lifecomparisonchart', 'lifecompare'],
            group: 'charts',
            memberName: 'lifecomparision',
            description: 'Compare the total lifetime playtime of multiple players',
            examples: ['comparelife', 'comparelife citrus_melon', 'comparelife @citrus-melon'],
            throttling: {duration: 10, usages: 3},
            args: [
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
    async run(message, { accounts }) {
        const players = [];
        const usernames = [];

        for (const account of accounts) {
            const player = await playerHelpers.getDiscordOrMinecraft(account, {dailyTotals: 1, lastIncremented: 1});
            if (typeof player === 'string') return message.reply(player);

            let sum = 0;
            for (const day of player.dailyTotals) sum += day;
            
            players.push(sum);
            usernames.push(await usernameCache.getUsernameByID(player._id));
        }

        const chart = new Chart(players, usernames, 'Lifetime Playtime Comparision');
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `life_comparision.png`);
        message.reply(attachment);
    }
};