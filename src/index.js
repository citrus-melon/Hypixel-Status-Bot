const getJSON = require('bent')('json');
const playerData = require('./playerData');
const playerHelpers = require('./helpers/playerHelpers');
require('./inlineReplyPatch');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const notification = require('./notification');
const logError = require('./helpers/logError');

const client = new CommandoClient({
    commandPrefix: 'h!',
    owner: process.env.OWNER_ID
});

client.registry
    .registerDefaults()
    .registerGroups([
        ['account', 'Account Management'],
        ['time', 'Playtime Totals'],
        ['charts', 'Playtime Charts']
    ])
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

/** @type {number} */
let lastTick;

class HypixelApiError extends Error {
    constructor (message) {
        super(message);
        this.name = 'HypixelApiError';
    }
}

const tickPlayer = async (player, now, tickDelta) => {
    const response = await getJSON(`https://api.hypixel.net/status?key=${process.env.HYPIXEL_KEY}&uuid=${player._id}`);
    if (response.success === false) throw new HypixelApiError(response.cause);

    /** @type {import('mongodb').UpdateQuery<import('./player')>}*/
    let updates = {$set:{}};

    if (response.session.online !== player.online) {
        updates.$set.online = response.session.online;
        
        notification.send(client, player._id, response.session.online)
        .catch(err => logError(err, 'while sending notification', client));
        
        const catchMissingMember = (err) => {
            if (err.code !== 10007) logError(err, `while updating role for ${player.discordID}`, client);
            playerData.updateOne({'discordID': discordID}, {$set: {discordID: null}});
        }
        notification.role(client, player.discordID, response.session.online).catch(catchMissingMember);
    }

    if (response.session.online) {
        updates.$inc = {
            'dailyHistory.0': tickDelta,
            'monthlyHistory.0': tickDelta,
        }
        updates.$inc[`dailyTotals.${now.getDay()}`] = tickDelta;
    }

    const dayUpdate = playerHelpers.changeDaysUpdate(player.lastIncremented, now);
    if (dayUpdate) await playerData.updateOne({_id: player._id, lastIncremented: player.lastIncremented}, dayUpdate);

    if (!response.session.online && response.session.online === player.online) return;
    updates.$set.lastIncremented = now;
    await playerData.updateOne({_id: player._id}, updates);
}

const tryTickPlayer = async (player) => {

}

const loopStatuses = async () => {
    const now = new Date();
    const tickDelta = Math.floor((now.getTime() - lastTick) / 60000);
    lastTick += tickDelta * 60000;

    const players = await playerData.findMultiple({"discordID":{$ne:null}})
        .project({online: 1, lastIncremented: 1, discordID: 1});
    
    for await (player of players) {
        tickPlayer(player, now, tickDelta)
        .catch((err) => logError(err, `while ticking player ${player._id}`, client));
    }
}

client.once('ready', async () => {
    try {
        process.on('unhandledRejection', (err) => logError(err, 'unhandled promise rejection', client));
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`${await playerData.countDoucments({"discordID":{$ne:null}})} statuses`, { type: 'WATCHING' });
        
        lastTick = Date.now();
        loopStatuses();
        setInterval(loopStatuses, 30000);
    } catch (error) {
        logError(error, 'while initializing', client);
    }
});

playerData.connect().then(() => client.login(process.env.BOT_TOKEN));