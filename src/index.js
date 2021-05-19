const getJSON = require('bent')('json');
const playerData = require('./playerData');
const playerHelpers = require('./helpers/playerHelpers');
require('./inlineReplyPatch');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const notification = require('./notification');

const client = new CommandoClient({
    commandPrefix: 'h!',
    owner: '711250473742499892',
    invite: 'https://discord.gg/cuRGH6Pc4k',
});

client.registry
    .registerDefaults()
    .registerGroups([
        ['account', 'Account Management'],
        ['time', 'Playtime Totals'],
        ['graphs', 'Playtime Graphs']
    ])
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

/** @type {number} */ let lastTick;

const catchMissingMember = (err) => {
    if (err.code !== 10007) throw err;
    playerData.updateOne({'discordID': discordID}, {$set: {discordID: null}});
}

const loopStatuses = async () => {
    const now = new Date();
    const tickDelta = Math.floor((now.getTime() - lastTick) / 60000);
    lastTick += tickDelta * 60000;

    const players = await playerData.findMultiple({"discordID":{$ne:null}})
        .project({online: 1, lastIncremented: 1, discordID: 1});
    for await (const player of players) {
        const response = await getJSON(`https://api.hypixel.net/status?key=${process.env.HYPIXEL_KEY}&uuid=${player._id}`);
        if (response.success === false) {
            console.error('Hypixel Api Error: ' + response.cause);
            continue;
        }

        const dayUpdate = playerHelpers.changeDaysUpdate(player.lastIncremented, now);
        if (dayUpdate) await playerData.updateOne({_id: player._id, lastIncremented: player.lastIncremented}, dayUpdate);

        /** @type {import('mongodb').UpdateQuery<import('./player')>}*/
        let updates = {$set:{}};

        if (response.session.online) {
            updates.$inc = {
                'dailyHistory.0': tickDelta,
                'monthlyHistory.0': tickDelta,
            }
            updates.$inc[`dailyTotals.${now.getDay()}`] = tickDelta;
        }
        
        if (response.session.online !== player.online) {
            updates.$set.online = response.session.online;
            notification.send(client, player._id, response.session.online);
            notification.role(client, player.discordID, response.session.online).catch(catchMissingMember);
        }

        if (!response.session.online && response.session.online === player.online) continue;
        updates.$set.lastIncremented = now;
        playerData.updateOne({_id: player._id}, updates);
    }
}

client.once('ready', async () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`${await playerData.countDoucments({"discordID":{$ne:null}})} statuses`, { type: 'WATCHING' });
        
        lastTick = Date.now();
        loopStatuses();
        setInterval(loopStatuses, 30000);
    } catch (error) {
        console.error(error);
    }
});

playerData.connect().then(() => client.login(process.env.BOT_TOKEN));