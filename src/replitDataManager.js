const { Collection } = require('discord.js'); // Collection is 'A Map with additional utility methods.'
const Database = require("@replit/database");
const fs = require('fs');

class Player {
    /**
     * @param {string} _id
     * @param {import('discord.js').Snowflake} discordID
     * @param {boolean} [online]
     * @param {number} [creationDate]
     * @param {number} [lastIncremented]
     * @param {?number[]} [dailyHistory]
     * @param {?number[]} [monthlyHistory]
     * @param {number[]} [dailyTotals]
     */
    constructor(_id, discordID, online, creationDate, lastIncremented, dailyHistory, monthlyHistory, dailyTotals) {
        this._id = _id;
        this.discordID = discordID;
        this.online = online || false;
        this.creationDate = creationDate || Date.now();
        this.lastIncremented = lastIncremented || this.creationDate;
        /** @type {?number[]}*/ this.dailyHistory = dailyHistory || new Array(30);
        /** @type {?number[]}*/ this.monthlyHistory = monthlyHistory || [0];
        /** @type {number[]}*/ this.dailyTotals = dailyTotals || [0, 0, 0, 0, 0, 0, 0];
    }
}

// Database
const db = new Database();

// Cache

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
let cache;

const cacheAll = async () => {
    /** @type {Collection<string, Player>} */
    const output = new Collection();
    for (const key of await db.list()) {
      const value = await db.get(key);
      output.set(key, value);
    }
    cache = output;
    console.log(output.entries());
};

// Public functions

/** @param {string} _id @param {Player} player */
const set = async (_id, player) => {
    await db.set(_id, player);
    if (cache) cache.set(_id, clonePlayer(player));
};

/** @param {string} _id */
const remove = async (_id) => {
    await db.delete(_id);
    if (cache) cache.delete(_id);
};

const getAll = async () => {
    if (!cache) await cacheAll();
    return cache.mapValues(player => clonePlayer(player));
};

/** @param {string} */
const getByMinecraft = async (_id) => {
    if (!cache) await cacheAll();
    return clonePlayer(cache.get(_id));
};

/** @param {import('discord.js').Snowflake} discordID */
const getByDiscord = async (discordID) => {
    if (!cache) await cacheAll();
    return clonePlayer(cache.find(player => player.discordID === discordID));
};

/** @returns {Promise<string[]>} */
const list = async () => {
    if (!cache) await cacheAll();
    return [...cache.keys()];
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