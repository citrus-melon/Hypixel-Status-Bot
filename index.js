const Discord = require('discord.js');
const getJSON = require('bent')('json');
const dataManager = require('./dataManager');
const commandManager = require('./commandManager');

const client = new Discord.Client();
client.commands = commandManager.loadCommandFiles('./commands');
client.prefix = '!status';

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

const loopStatuses = () => {
    const tickDelta = Math.floor((Date.now() - lastTick) / 60000);
    lastTick += tickDelta * 60000;

    dataManager.trackedPlayers.each(async player => {
        const response = await getJSON(`https://api.hypixel.net/status?key=${process.env.HYPIXEL_KEY}&uuid=${player.mcID}`);

        if (response.success === false) {
            console.error('Hypixel Api Error: ' + response.cause);
            return;
        }

        const member = await guild.members.fetch(player.discordID);

        if (response.session.online) dataManager.incrementTime(player.mcID, tickDelta);
        
        if (response.session.online === player.online) return;
        console.log(`${member.displayName} state change to ${response.session.online}`)
        sendNotification(member.displayName, player.mcID, response.session.online);
        updateRole(member, response.session.online);
        dataManager.setStatus(player.mcID, response.session.online);
    });
}

client.on('ready', async () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`${dataManager.trackedPlayers.size} statuses`, { type: 'WATCHING' });

        guild = await client.guilds.fetch(process.env.GUILD_ID);
        role = await guild.roles.fetch(process.env.ROLE_ID);
        lastTick = Date.now();

        loopStatuses();
        setInterval(loopStatuses, 30000);
    } catch (error) {
        console.error(error);
    }
});

client.on('message', commandManager.handleMessage);

client.login(process.env.BOT_TOKEN);