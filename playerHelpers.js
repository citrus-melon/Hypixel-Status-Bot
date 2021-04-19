const {Player} = require('./dataManager');

/** @param {Player} input */
const clonePlayer = (input) => {
    return new Player(
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

/** @param {Player} player @param {Date} now */
const tryChangeDays = (player, now) => {
    player = clonePlayer(player);
    const dayDelta = now.getDate() - new Date(player.lastIncremented).getDate();
    for (let index = 0; index < dayDelta; index++) {
        player.dailyHistory.length++;
        player.dailyHistory.shift();
    }
    if(!player.dailyHistory[player.dailyHistory.length-1]) player.dailyHistory[player.dailyHistory.length-1] = 0;

    const monthDelta = now.getMonth() - new Date(player.lastIncremented).getMonth();
    player.monthlyHistory.length += monthDelta;
    if(!player.monthlyHistory[player.monthlyHistory.length-1]) player.monthlyHistory[player.monthlyHistory.length-1] = 0;

    player.lastIncremented = now.getTime();
    return player;
};

module.exports = {
    tryChangeDays: tryChangeDays
};