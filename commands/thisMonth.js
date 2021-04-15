const dataManager = require('../dataManager');

module.exports.names = ['month', 'thismonth'];

/** @param {import('discord.js').Message} message @param {string[]} args */
module.exports.execute = async (message) => {
    const target = message.mentions.users.first() || message.author;
    const discordID = target.id;

    const player = await dataManager.getPlayerByDiscord(discordID);
    await dataManager.tryChangeDays(player, new Date());

    if (!player) {
        message.reply(`${target.tag} doesn't have a linked Minecraft account!`);
        return;
    }
    message.reply(`this month you/they have played for ${player.monthlyHistory[player.monthlyHistory.length-1]} minutes!`);
}