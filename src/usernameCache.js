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


const fetchUsernameByID = async (id) => {
    const response = await sessionServer(id);
    const sameUsername = cache.findKey(item => item.username.toLowerCase() === response.name.toLowerCase());
    cache.delete(sameUsername);
    cache.set(response.id, new CacheItem(response.id, response.name));
    return response.name;
}

const fetchIDByUsername = async (username) => {
    const response = await api(username);
    if (response.statusCode === 204) {
        const sameUsername = cache.findKey(item => item.username.toLowerCase() === username.toLowerCase());
        cache.delete(sameUsername);
        return null;
    }
    const jsonResponse = await response.json();

    const sameUsername = cache.findKey(item => item.username.toLowerCase() === jsonResponse.name.toLowerCase());
    cache.delete(sameUsername);
    cache.set(jsonResponse.id, new CacheItem(jsonResponse.id, jsonResponse.name));
    return jsonResponse.id;
}

const getIDByUsername = async (username) => {
    const cacheResult = cache.find(item => item.username.toLowerCase() === username.toLowerCase());
    if (!cacheResult) return await fetchIDByUsername(username);
    if (cacheResult.expired) fetchIDByUsername(username);
    return cacheResult.id;
}

const getUsernameByID = async (id) => {
    const cacheResult = cache.get(id);
    if (!cacheResult) return await fetchUsernameByID(id);
    if (cacheResult.expired) fetchUsernameByID(id);
    return cacheResult.username;
}

module.exports = {
    getUsernameByID: getUsernameByID,
    getIDByUsername: getIDByUsername,
    fetchIDByUsername: fetchIDByUsername,
    fetchUsernameByID: fetchUsernameByID
}