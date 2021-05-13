const { Player } = require('./playerData');

module.exports = class Player {
    /**
     * @param {string} _id The Minecraft ID of the player
     * @param {import('discord.js').Snowflake} discordID The id of any linked Discord account
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
        /** @type {?number[]}*/ this.dailyHistory = dailyHistory || new Array(30).fill(null);
        /** @type {?number[]}*/ this.monthlyHistory = monthlyHistory || [0];
        /** @type {number[]}*/ this.dailyTotals = dailyTotals || [0, 0, 0, 0, 0, 0, 0];
    }
}