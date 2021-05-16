module.exports = class Player {
    /**
     * @param {string} _id The Minecraft ID of the player
     * @param {string} discordID The id of any linked Discord account
     * @param {boolean} [online] Whether or not the player is currently online
     * @param {number} [creationDate] The date that this player was first tracked
     * @param {number} [lastIncremented] The most reccent date the playtime statistics were incremented
     * @param {?number[]} [dailyHistory] Total playtime for the past 30 days, 29th item is latest day
     * @param {?number[]} [monthlyHistory] Total playtime for each month, 0th item is latest month
     * @param {number[]} [dailyTotals] Total playtime on each day of the week, 0th is Sunday
     */
    constructor(_id, discordID, online, creationDate, lastIncremented, dailyHistory, monthlyHistory, dailyTotals) {
        /** @type {string} _id The Minecraft ID of the player */
        this._id = _id;
        /** @type {string} discordID The id of any linked Discord account */
        this.discordID = discordID;
        /** @type {boolean} online Whether or not the player is currently online */
        this.online = online || false;
        /** @type {Date} creationDate The date that this player was first tracked */
        this.creationDate = creationDate || new Date();
        /**  @type {Date} lastIncremented The most reccent date the playtime statistics were incremented */
        this.lastIncremented = lastIncremented || this.creationDate;
        /** @type {?number[]} dailyHistory Total playtime for the past 30 days, 29th item is latest day */
        this.dailyHistory = dailyHistory || new Array(30).fill(null);
        /** @type {?number[]} monthlyHistory Total playtime for each month, 0th item is latest month*/
        this.monthlyHistory = monthlyHistory || [0];
        /** @type {number[]} dailyTotals Total playtime on each day of the week, 0th is Sunday*/
        this.dailyTotals = dailyTotals || [0, 0, 0, 0, 0, 0, 0];
    }
}
