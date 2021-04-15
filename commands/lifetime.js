const dataManager = require('../dataManager');

module.exports.names = ['lifetime'];

/** @param {import('discord.js').Message} message @param {string[]} args */
module.exports.execute = async (message) => {
    const target = message.mentions.users.first() || message.author;
    const discordID = target.id;

    const player = await dataManager.getPlayerByDiscord(discordID);

    if (!player) {
        message.reply(`${target.tag} doesn't have a linked Minecraft account!`);
        return;
    }

    let sum = 0;
    for (const day of player.dailyTotals) {
        sum += day;
    }

    message.reply(`You have played a total of ${sum} minutes while tracked!`);
}