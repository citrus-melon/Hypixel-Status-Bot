const { Collection } = require('discord.js'); // Collection is 'A Map with additional utility methods.'
const fs = require('fs');
const Player = require('./player');

// Placeholder "DB" Backend

/** @param {Player} input */
const clonePlayer = (input) => {
    if (!input) return input;
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

/** @type {Collection<string, Player>} */
let trackedPlayers = new Collection(); // Stores all tracked players, essentially static
if (fs.existsSync('data.json')) { // If saved data file exists, load it
    const fileContent = fs.readFileSync('data.json');
    const data = JSON.parse(fileContent);
    for (const player of data) trackedPlayers.set(player.mcID, player);
}

const writeFile = () => {
    const fileContent = JSON.stringify(trackedPlayers.array(), null, 2);
    fs.writeFile('data.json', fileContent, (err) => {
        if (err) console.log(err);
    });
};

// Public functions

/** @param {string} mcID @param {Player} player */
const set = async (mcID, player) => {
    trackedPlayers.set(mcID, clonePlayer(player));
    writeFile();
};

/** @param {string} mcID */
const remove = async (mcID) => {
    trackedPlayers.delete(mcID);
    writeFile();
};

const getAll = async () => {
    return trackedPlayers.mapValues(player => clonePlayer(player));
};

/** @param {string} */
const getByMinecraft = async (mcID) => {
    return clonePlayer(trackedPlayers.get(mcID));
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