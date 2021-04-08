const Discord = require("discord.js");
const getHTTPS = require("./getHTTPS");
const fs = require('fs');
const commandManager = require('./commandManager');

const client = new Discord.Client();
client.commands = commandManager.loadCommandFiles('./commands');
client.prefix = '!status';

let notificationChannel, role, users;

const loopStatuses = () => {
    users.forEach(async user => {
        const rawData = await getHTTPS(`https://api.hypixel.net/status?key=${process.env.hypixelApiKey}&uuid=${user.mcUUID}`);
        const data = JSON.parse(rawData);
        if (data.success === false) {
            console.error("Hypixel Api Error: " + data.cause);
            return;
        }
        if (data.session.online != user.online) {
            user.online = data.session.online;
            let embed;
            if (user.online) {
                embed = new Discord.MessageEmbed()
                    .setColor('#91ff8f')
                    .setAuthor(user.member.displayName + ' is now online', 'https://crafatar.com/avatars/'+user.mcUUID)
                user.member.roles.add(role);
            } else {
                embed = new Discord.MessageEmbed()
                    .setColor('#ff8f8f')
                    .setAuthor(user.member.displayName + ' is now offline', 'https://crafatar.com/avatars/'+user.mcUUID)
                user.member.roles.remove(role);
            }
            notificationChannel.send(embed);
        }
    });
}

client.on('ready', async () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`)
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        notificationChannel = await client.channels.fetch(process.env.CHANNEL_ID);
        role = await guild.roles.fetch(process.env.ROLE_ID);
        for (const user of users) {
            user.member = await guild.members.fetch(user.discordID);
            if(user.member.roles.cache.has(role.id)) user.online = true;
        }
        client.user.setActivity(`${users.length} statuses`, { type: 'WATCHING' });
        setInterval(loopStatuses, 30000);
    } catch (error) {
        console.error(error);
    }
});

client.on('message', commandManager.handleMessage);

const rawData = fs.readFileSync('data.json');
users = JSON.parse(rawData);
client.login(process.env.BOT_TOKEN);