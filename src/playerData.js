const { Collection } = require('discord.js'); // Collection is 'A Map with additional utility methods.'
const fs = require('fs');
const Player = require('./player');

// Placeholder "DB" Backend

/** @param {Player} input */
const clonePlayer = (input) => {
    if (!input) return input;
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

/** @type {Collection<string, Player>} */
let trackedPlayers = new Collection(); // Stores all tracked players, essentially static
if (fs.existsSync('data.json')) { // If saved data file exists, load it
    const fileContent = fs.readFileSync('data.json');
    const data = JSON.parse(fileContent);
    for (const player of data) trackedPlayers.set(player._id, player);
}

const writeFile = () => {
    const fileContent = JSON.stringify(trackedPlayers.array(), null, 2);
    fs.writeFile('data.json', fileContent, (err) => {
        if (err) console.log(err);
    });
};

// Public functions

/** @param {string} _id @param {Player} player */
const set = async (_id, player) => {
    trackedPlayers.set(_id, clonePlayer(player));
    writeFile();
};

/** @param {string} _id */
const remove = async (_id) => {
    trackedPlayers.delete(_id);
    writeFile();
};

const getAll = async () => {
    return trackedPlayers.mapValues(player => clonePlayer(player));
};

/** @param {string} */
const getByMinecraft = async (_id) => {
    return clonePlayer(trackedPlayers.get(_id));
};

/** @param {import('discord.js').Snowflake} discordID */
const getByDiscord = async (discordID) => {
    return clonePlayer(trackedPlayers.find(player => player.discordID === discordID));
};

/** @returns {string[]} */
const list = () => {
    return [...trackedPlayers.keys()];
};

// Exports
module.exports = {
    Player: Player,
    set: set,
    remove: remove,
    getAll: getAll,
    getByMinecraft: getByMinecraft,
    getByDiscord: getByDiscord,
    list:list
};