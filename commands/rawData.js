const dataManager = require('../dataManager');

module.exports.names = ['rawdata'];

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
    message.reply('Raw data for ' + target.tag + ':```json\n' + JSON.stringify(player, null, 2) + '\n```');
}