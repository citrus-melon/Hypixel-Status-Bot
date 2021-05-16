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

/** @param {number[]} history @param {Date} lastIncremented @param {Date} now */
module.exports.adjustDailyHistory = (history, lastIncremented, now) => {
    if (now - lastIncremented > CLEAR_DAYS_THRESHOLD) {
        history = new Array(30).fill(null);
    } else {
        history = [...history];
        for (
            let index = new Date(lastIncremented);
            now - index > SKIP_DAY_THRESHOLD || now.getDate() !== index.getDate();
            index.setDate(index.getDate()+1)
        ) {
            history.push(null);
            history.shift();
        }
    }
    return history;
}

/** @param {number[]} history @param {Date} lastIncremented @param {Date} now */
module.exports.adjustMonthlyHistory = (history, lastIncremented, now) => {
    history = [...history];
    let monthDelta = now.getMonth() - lastIncremented.getMonth()
    monthDelta += (now.getFullYear() - lastIncremented.getFullYear()) * 12;

    for (let index = 0; index < monthDelta; index++) {
        history.unshift(null);
    }

    return history;
};

module.exports.changeDaysUpdate = (lastIncremented, now) => {
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

/** @param {import('discord.js').User|string} search */
module.exports.getDiscordOrMinecraft = async (search, projection) => {
    /** @type {import('../player')} */ let player;
    if (typeof search === 'string') { // It is a Minecraft ID
        player = await playerData.findOne({'_id': search}, projection);
        if (!player) return `The player \`${await usernameCache.getUsernameByID(search)}\` does not have any tracked data!`;
    } else { // It is a Discord user
        player = await playerData.findOne({'discordID': search.id}, projection);
        if (!player) return`\`${search.tag}\` does not have a linked Minecraft account!`;
    }
    return player;
}