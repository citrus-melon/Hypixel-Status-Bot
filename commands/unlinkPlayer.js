const dataManager = require('../dataManager');

module.exports.names = ['unlink'];

/** @param {import('discord.js').Message} message @param {string[]} args */
module.exports.execute = async (message, [mcName]) => {
    const target = message.mentions.users.first() || message.author;
    const discordID = target.id;

    const player = await dataManager.getPlayerByDiscord(discordID);

    if (!player) {
        message.reply(`${target.tag} is already unlinked!`);
        return;
    }

    dataManager.untrackPlayer(player.mcID);
    message.reply(`Sucessfully unlinked ${target.tag}!`)
}