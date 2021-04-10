const getJSON = require('bent')('json');
const dataManager = require('../dataManager');

module.exports.names = ['link'];

/** @param {import('discord.js').Message} message @param {string[]} args */
module.exports.execute = async (message, [mcName]) => {
    const target = message.mentions.users.first() || message.author;
    const discordID = target.id;
    
    const validUsername = /^\w{3,16}$/i;
    if(!mcName || !validUsername.test(mcName)) {
        message.reply(`${mcName} is not a valid Minecraft username!`);
        return; 
    }

    try {
        const response = await getJSON('https://api.mojang.com/users/profiles/minecraft/' + mcName);
        const mcID = response.id;
        const player = new dataManager.Player(mcID, discordID);
        dataManager.trackPlayer(player);
        message.reply(`sucessfully linked ${target.tag} to ${mcName}!`)
    }
    
    catch (error) {
        if (error.name === 'StatusError' && error.statusCode === 204) {
          message.reply(`couldn't find a Minecraft player with the username ${mcName}!`)
        }
        else throw error;
    }
}