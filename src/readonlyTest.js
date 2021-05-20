const playerData = require('./playerData');
require('./inlineReplyPatch');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

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

client.once('ready', () => console.log(`Logged in as ${client.user.tag}!`));
playerData.connect().then(() => client.login(process.env.BOT_TOKEN));