const fs = require('fs');
const Discord = require('discord.js');

const loadCommandFiles = (directory) => {
    const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
    let commands = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command);
    }
    return commands;
}

/** @param {Discord.Message} message */
const handleMessage = (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(message.client.prefix)) return;
    
    const arguments = 
    message.content.slice(message.client.prefix.length) // remove the prefix from the start
    .replace(/\r?\n|\r/g, " ") // regexp that replaces newlines with spaces
    .match(/"[^"]+"|[\S]+/g) // regexp sorcery that separates by spaces outside of quotes
    .map(argument => argument.replace(/"/g, '')); // remove quotes from each argument
    
    const commandName = arguments.shift().toLowerCase();
    
    const command = message.client.commands.find(cmd => cmd.names.includes(commandName));
    if (command) command.execute(message, arguments);
}

module.exports.handleMessage = handleMessage;
module.exports.loadCommandFiles = loadCommandFiles;