const dataManager = require('./dataManager');
const usernameCache = require('./usernameCache');

/** @param {dataManager.Player} input */
const clonePlayer = (input) => {
    return new dataManager.Player(
        input.mcID,
        input.discordID,
        input.online,
        input.creationDate,
        input.lastIncremented,
        [...input.dailyHistory],
        [...input.monthlyHistory],
        [...input.dailyTotals]
    );
};

/** @param {dataManager.Player} player @param {Date} now */
const tryChangeDays = (player, now) => {
    player = clonePlayer(player);
    const dayDelta = now.getDate() - new Date(player.lastIncremented).getDate();
    for (let index = 0; index < dayDelta; index++) {
        player.dailyHistory.push(null);
        player.dailyHistory.shift();
    }
    if(!player.dailyHistory[player.dailyHistory.length-1]) player.dailyHistory[player.dailyHistory.length-1] = 0;

    const monthDelta = now.getMonth() - new Date(player.lastIncremented).getMonth();
    for (let index = 0; index < dayDelta; index++) {
        player.dailyHistory.push(null);
    }
    if(!player.monthlyHistory[player.monthlyHistory.length-1]) player.monthlyHistory[player.monthlyHistory.length-1] = 0;

    player.lastIncremented = now.getTime();
    return player;
};

const getDiscordOrMinecraft = async (input) => {
    const player = typeof input === 'string' ? await dataManager.getByMinecraft(input) : await dataManager.getByDiscord(input.id);
    if (!player && typeof input === 'string') {
        return `The player \`${await usernameCache.getUsernameByID(input)}\` does not have any tracked data!`;
    } else if (!player) {
        return`\`${input.tag}\` does not have a linked Minecraft account!`;
    }
    return player;
}

module.exports = {
    tryChangeDays: tryChangeDays,
    getDiscordOrMinecraft: getDiscordOrMinecraft
};