const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const chartRenderer = require('../../chartRenderer');
const Chart = require('../../charts/comparison');
const playerHelpers = require('../../helpers/playerHelpers');
const usernameCache = require('../../usernameCache');

module.exports = class lifetimeComparison extends Command {
    constructor(client) {
        super(client, {
            name: 'lifetimecomparison',
            aliases: ['lifecomparison', 'lifecompare', 'comparelife', 'comparelifetime', 'cl', 'lifetimecompare'],
            group: 'charts',
            memberName: 'lifecomparison',
            description: 'Compare the total lifetime playtime of multiple players.',
            examples: ['lifecomparison @citrus_melon yambots'],
            throttling: {duration: 10, usages: 3},
            args: [
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
    async run(message, { accounts }) {
        if (accounts.length < 2 || accounts.length > 10) return message.reply('Please enter between 2-10 players!');

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

        const chart = new Chart(players, usernames, 'Lifetime Playtime Comparison');
        const image = await chartRenderer.renderToBuffer(chart);
        const attachment = new MessageAttachment(image, `life_comparison.png`);
        return message.reply(attachment);
    }
};