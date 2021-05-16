const { ArgumentType } = require('discord.js-commando');
const usernameCache = require('../usernameCache');

class MinecraftAccountArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'minecraftaccount');
    }
    
    async validate(val, msg, arg) {
        const validUsername = /^\w{3,16}$/i;
        if (!validUsername.test(val)) return false;

        const id = await usernameCache.getIDByUsername(val);
        if(!id) return `Couldn't find a player with that username! Please try again.`;
        return true;
    }

    async parse(val, msg, arg) {
        return await usernameCache.getIDByUsername(val);
    }
}

module.exports = MinecraftAccountArgumentType;