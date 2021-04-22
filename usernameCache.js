const { Collection } = require('discord.js');
const Bent = require('bent');
const api = Bent('https://api.mojang.com/users/profiles/minecraft/', 200, 204);
const sessionServer = Bent('https://sessionserver.mojang.com/session/minecraft/profile/', 'json');

const itemLifespan = 120000;

/** @type {Collection<string, CacheItem>} */
const cache = new Collection();

class CacheItem {
    constructor (id, username) {
        this.id = id;
        this.username = username;
        this.expires = Date.now() + itemLifespan;
    }
    get expired () {
        return this.expires < Date.now();
    }
}

const getIDByUsername = async (username, force) => {
    const cacheResult = cache.get(username);

    if (cacheResult && !(cacheResult.expired || force)) {
        return cacheResult.id;
    }

    const response = await api(username);

    if (response.statusCode === 204) {
        cache.set(username, new CacheItem(null, username));
        return null;
    }

    const jsonResponse = await response.json();

    cache.set(jsonResponse.name, new CacheItem(jsonResponse.id, jsonResponse.name));
    return jsonResponse.id;
}

const getUsernameByID = async (id) => {
    const cacheResult = cache.find(item => item.id === id);

    if (cacheResult) {
        if (cacheResult.expired) cache.delete(cacheResult.username);
        else return cacheResult.username;
    }

    const response = await sessionServer(id);

    cache.set(response.name, new CacheItem(response.id, response.name));
    return response.name;
}

module.exports = {
    getUsernameByID: getUsernameByID,
    getIDByUsername: getIDByUsername
}