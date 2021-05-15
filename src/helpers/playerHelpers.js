const playerData = require('../playerData');
const Player = require('../player');
const usernameCache = require('../usernameCache');

/** @param {Player} input */
const clonePlayer = (input) => {
    return new Player(
        input._id,
        input.discordID,
        input.online,
        input.creationDate,
        input.lastIncremented,
        [...input.dailyHistory],
        [...input.monthlyHistory],
        [...input.dailyTotals]
    );
};

const CLEAR_DAYS_THRESHOLD = 1000*60*60*24*31;
const SKIP_DAY_THRESHOLD = 1000*60*60*24*48;

/** @param {Player} player @param {Date} now */
const tryChangeDays = (player, now) => {
    player = clonePlayer(player);
    const lastIncremented = new Date(player.lastIncremented);

    if (now - player.lastIncremented > CLEAR_DAYS_THRESHOLD) {
        player.dailyHistory = new Array(30).fill(null);
    } else {
        for (
            let index = new Date(lastIncremented);
            now - index > SKIP_DAY_THRESHOLD || now.getDate() !== index.getDate();
            index.setDate(index.getDate()+1)
        ) {
            player.dailyHistory.push(null);
            player.dailyHistory.shift();
        }
    }

    const monthDelta = now.getMonth() - lastIncremented.getMonth()
        + (now.getFullYear() - lastIncremented.getFullYear()) * 12;
    for (let index = 0; index < monthDelta; index++) {
        player.monthlyHistory.push(null);
    }

    if(!player.dailyHistory[player.dailyHistory.length-1]) player.dailyHistory[player.dailyHistory.length-1] = 0;
    if(!player.monthlyHistory[player.monthlyHistory.length-1]) player.monthlyHistory[player.monthlyHistory.length-1] = 0;
    player.lastIncremented = now.getTime();
    return player;
};

const changeDaysUpdate = (lastIncremented, now) => {
    let addedDays = [], addedMonths = [], updates = {};
    if (now - lastIncremented > CLEAR_DAYS_THRESHOLD) {
        addedDays = new Array(30).fill(null);
    } else {
        for (
            let index = new Date(lastIncremented);
            now - index > SKIP_DAY_THRESHOLD || now.getDate() !== index.getDate();
            index.setDate(index.getDate()+1)
        ) {
            addedDays.push(null);
        }
    }
    if (!addedDays.length) return null;

    const monthDelta = now.getMonth() - lastIncremented.getMonth()
        + (now.getFullYear() - lastIncremented.getFullYear()) * 12;
    addedMonths = new Array(monthDelta).fill(null);

    if(addedDays[addedDays.length-1] !== undefined) addedDays[addedDays.length-1] = 0;
    if(addedMonths[0] !== undefined) addedMonths[0] = 0;

    if (!addedMonths.length) updates.$push = {dailyHistory:{$each:addedDays, $slice:-30}};
    else updates.$push = {dailyHistory:{$each:addedDays, $slice:-30}, monthlyHistory:{$each:addedMonths, $position: 0}}
    updates.$set = {lastIncremented: now};
    return updates;
}

const getDiscordOrMinecraft = async (input) => {
    const player = typeof input === 'string' ? await playerData.getByMinecraft(input) : await playerData.getByDiscord(input.id);
    if (!player && typeof input === 'string') {
        return `The player \`${await usernameCache.getUsernameByID(input)}\` does not have any tracked data!`;
    } else if (!player) {
        return`\`${input.tag}\` does not have a linked Minecraft account!`;
    }
    return player;
}

module.exports = {
    tryChangeDays: tryChangeDays,
    getDiscordOrMinecraft: getDiscordOrMinecraft,
    changeDaysUpdate: changeDaysUpdate
};