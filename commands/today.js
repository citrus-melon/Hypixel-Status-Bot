const dataManager = require('../dataManager');

module.exports.names = ['today'];

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
    message.reply(`Today you/they have played for ${player.dailyHistory[player.dailyHistory.length-1]} minutes`);
}