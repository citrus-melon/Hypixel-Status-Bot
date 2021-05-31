const Discord = require("discord.js")
const readline = require("readline");
const fs = require('fs/promises');
const Player = require("../src/player");

const client = new Discord.Client();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const now = new Date();
/** @type {Discord.Collection<Player>} */
const players = new Discord.Collection();

function daysBetween(start, end) {
    if (start > end) return 0;
    let index = new Date(start), count = 0;
    while (end - index > 1000*60*60*24*2 || end.getDate() !== index.getDate()) {
        index.setDate(index.getDate()+1);
        count++;
    }
    return count;
}

function monthsBetween(start, end) {
    return monthDelta = start.getMonth() - end.getMonth()
    + (start.getFullYear() - end.getFullYear()) * 12;
}

function addTime(player, start, end) {
    const playtime = Math.round((end-start)/(60*1000));
    const daysAgo = daysBetween(start, now);
    player.dailyHistory[daysAgo] += playtime;
    const monthsAgo = monthsBetween(start, now);
    player.monthlyHistory[monthsAgo] += playtime;
    player.dailyTotals[start.getDay()] += playtime;
}

function processTimeframe(player, start, end) {
    if (daysBetween(start, end)) {
        const firstDayEnd = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59);
        addTime(player, start, firstDayEnd);
        const secondDayStart = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        addTime(player, secondDayStart, end);
    } else addTime(player, start, end);
}

class ParsingError extends Error {
    constructor(message) {
      super(message)
      this.name = "ParsingError"
    } 
}

/** @param {Discord.Message} message */
function parseMessage(message) {
    const output = {};
    if (message.author.id !== client.user.id) throw new ParsingError('Message not from self');
    const embed = message.embeds[0];

    if (!embed) throw new ParsingError('Message missing embed');
    if (!embed.author || !embed.author.name || !embed.author.iconURL) throw new ParsingError('Embed author invalid');

    if (embed.author.name.endsWith('is now online')) output.online = true;
    else if (embed.author.name.endsWith('is now offline')) output.online = false;
    else throw new ParsingError('Embed missing online/offline');

    output.mcID = embed.author.iconURL.slice(29);
    output.date = message.createdAt;
    
    return output;
}

/** @param {Discord.Message} message*/
function processMessage(message) {
    try {
        const parsedMessage = parseMessage(message);
        let player = players.get(parsedMessage.mcID);
        if (!player) {
            player = new Player(parsedMessage.mcID, null, parsedMessage.online, now);
            player.dailyHistory.fill(0);
            players.set(parsedMessage.mcID, player);
        }

        if (parsedMessage.online && !player.online) processTimeframe(player, parsedMessage.date, player.creationDate);
        player.online = parsedMessage.online;
        player.creationDate = parsedMessage.date;
    }
    catch (err) {
        if (err instanceof ParsingError) console.log(`Skipped message ${message.url} due to ` + err);
        console.error(`Unexpected error while parsing message ${message.url}:`);
        console.error(err);
    }
}

/** @param {Discord.TextChannel} channel */
async function doExport(channel) {
    console.log('Starting export...');
    
    let lastID;
    const limit = new Date(now.getFullYear(), now.getMonth(), now.getDate()-29);

    while (true) {
        console.log(`Fetching batch before message ${lastID}`);
        const options = { limit: 100 };
        if (lastID) options.before = lastID;
        const messageBatch = await channel.messages.fetch(options);
        lastID = messageBatch.lastKey();
        
        for (const [id, message] of messageBatch) {
            if(message.createdAt < limit) return players;
            processMessage(message);
        }

        if (messageBatch.size != 100) return players;
    }
}

async function getChannel() {
    rl.question("Channel id: ", async (id) => {
        rl.close();
        let channel = await client.channels.fetch(id);
        if (!channel.isText()) return console.error('Not a text channel');
        const data = await doExport(channel);
        const filename = `Export_${now.getTime()}.json`;
        await fs.writeFile(filename, JSON.stringify(data.array(), null, 4));
        console.log(`Succesfully Exported Data to ${filename}!`);
    })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    getChannel();
})

rl.question("Bot id: ", (id) => client.login(id));