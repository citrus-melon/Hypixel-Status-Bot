const Discord = require('discord.js');
const getJSON = require('bent')('json');
const playerData = require('./playerData');
const playerHelpers = require('./helpers/playerHelpers');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

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


/** @type {Discord.Guild} */ let guild;
/** @type {Discord.Role} */ let role;
/** @type {number} */ let lastTick;

const sendNotification = (username, mcID, online) => {
    const notificationChannel = client.channels.cache.get(process.env.CHANNEL_ID);
    const embed = new Discord.MessageEmbed();
    if (online === true) {
        embed.setColor('#91ff8f');
        embed.setAuthor(username + ' is now online', 'https://crafatar.com/avatars/' + mcID)
    } else {
        embed.setColor('#ff8f8f')
        embed.setAuthor(username + ' is now offline', 'https://crafatar.com/avatars/' + mcID)
    }
    notificationChannel.send(embed);
}

const updateRole = (member, online) => {
    if (online) member.roles.add(role);
    else member.roles.remove(role);
}

const loopStatuses = async () => {
    const now = new Date();
    const tickDelta = Math.floor((now.getTime() - lastTick) / 60000);
    lastTick += tickDelta * 60000;

    /** @type {import('mongodb').Cursor<import('./player')>} */
    const players = await playerData.findMultiple({"discordID":{$ne:null}})
        .project({online: 1, lastIncremented: 1, discordID: 1});
    for await (const player of players) {
        const response = await getJSON(`https://api.hypixel.net/status?key=${process.env.HYPIXEL_KEY}&uuid=${player._id}`);
        if (response.success === false) {
            console.error('Hypixel Api Error: ' + response.cause);
            return;
        }

        const dayUpdate = playerHelpers.changeDaysUpdate(player.lastIncremented, now);
        if (dayUpdate) await playerData.updateOne({_id: player._id, lastIncremented: player.lastIncremented}, dayUpdate);

        /** @type {import('mongodb').UpdateQuery<*>*/
        let updates = {$set:{}};

        if (response.session.online) {
            console.log('shound incorement ' + tickDelta)
            updates.$inc = {
                'dailyHistory.29': tickDelta,
                'monthlyHistory.0': tickDelta,
            }
            updates.$inc[`dailyTotals.${now.getDay()}`] = tickDelta;
        }
        
        if (response.session.online !== player.online) {
            const member = await guild.members.fetch(player.discordID);
            updates.$set.online = response.session.online;
            console.log(`${member.displayName} state change to ${response.session.online}`)
            sendNotification(member.displayName, player._id, response.session.online);
            updateRole(member, response.session.online);
        }

        if (!response.session.online && response.session.online === player.online) return;
        updates.$set.lastIncremented = now;
        playerData.updateOne({_id: player._id}, updates);
    }
}

client.once('ready', async () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(await playerData.findMultiple({}).toArray());
        client.user.setActivity(`${await playerData.countDoucments({"discordID":{$ne:null}})} statuses`, { type: 'WATCHING' });

        guild = await client.guilds.fetch(process.env.GUILD_ID);
        role = await guild.roles.fetch(process.env.ROLE_ID);
        lastTick = Date.now();

        loopStatuses();
        setInterval(loopStatuses, 30000);
    } catch (error) {
        console.error(error);
    }
});

playerData.connect().then(() => client.login(process.env.BOT_TOKEN));