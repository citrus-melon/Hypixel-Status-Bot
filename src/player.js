module.exports = class Player {
    /**
     * @param {string} mcID
     * @param {import('discord.js').Snowflake} discordID
     * @param {boolean} [online]
     * @param {number} [creationDate]
     * @param {number} [lastIncremented]
     * @param {?number[]} [dailyHistory]
     * @param {?number[]} [monthlyHistory]
     * @param {number[]} [dailyTotals]
     */
    constructor(mcID, discordID, online, creationDate, lastIncremented, dailyHistory, monthlyHistory, dailyTotals) {
        this.mcID = mcID;
        this.discordID = discordID;
        this.online = online || false;
        this.creationDate = creationDate || Date.now();
        this.lastIncremented = lastIncremented || this.creationDate;
        /** @type {?number[]}*/ this.dailyHistory = dailyHistory || new Array(30).fill(null);
        /** @type {?number[]}*/ this.monthlyHistory = monthlyHistory || [0];
        /** @type {number[]}*/ this.dailyTotals = dailyTotals || [0, 0, 0, 0, 0, 0, 0];
    }
}