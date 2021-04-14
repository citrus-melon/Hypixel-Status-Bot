const { Collection } = require('discord.js'); // Collection is 'A Map with additional utility methods.'
const fs = require('fs');

class Player {
    /**
     * @param {string} mcID
     * @param {import('discord.js').Snowflake} discordID
     */
    constructor(mcID, discordID) {
        this.mcID = mcID;
        this.discordID = discordID;
        this.online = false;
        /** @type {number}*/ this.creationDate = Date.now();
        /** @type {number}*/ this.lastIncremented = Date.now();
        /** @type {number[]}*/ this.dailyHistory = new Array(30).fill(0);
        /** @type {number[]}*/ this.monthlyHistory = [0];
        /** @type {number[]}*/ this.dailyTotals = [0, 0, 0, 0, 0, 0, 0];
    }
}

/** @type {Collection<string, Player>} */
let trackedPlayers = new Collection(); // Stores all tracked players, essentially static
if (fs.existsSync('data.json')) { // If saved data file exists, load it
    const fileContent = fs.readFileSync('data.json');
    const data = JSON.parse(fileContent);
    for (const player of data) trackedPlayers.set(player.mcID, player);
}

const writeFile = () => {
    const fileContent = JSON.stringify(trackedPlayers.array(), 2);
    fs.writeFile('data.json', fileContent, (err) => {
        if (err) console.log(err);
    });
}

// Public functions

/** @param {Player} player */
const trackPlayer = async (player) => {
    const sameDiscord = await getPlayerByDiscord(player.discordID)
    if (sameDiscord) await untrackPlayer(sameDiscord.mcID);
    trackedPlayers.set(player.mcID, player);
    writeFile();
}

const untrackPlayer = async (mcID) => {
    trackedPlayers.delete(mcID);
    writeFile();
};

const setStatus = async (mcID, status) => {
    trackedPlayers.get(mcID).online = status;
    writeFile();
}

const incrementTime = async (mcID, increment) => {
    const player = trackedPlayers.get(mcID);
    player.dailyHistory[0] += increment;
    player.monthlyHistory[player.monthlyHistory.length] += increment;
    writeFile();
}

const getPlayerByDiscord = async (discordID) => trackedPlayers.find(player => player.discordID == discordID);

// Export public functions and variables
module.exports.trackedPlayers = trackedPlayers;
module.exports.trackPlayer = trackPlayer;
module.exports.untrackPlayer = untrackPlayer;
module.exports.getPlayerByDiscord = getPlayerByDiscord;
module.exports.setStatus = setStatus;
module.exports.incrementTime = incrementTime;
module.exports.Player = Player;