const { ArgumentType } = require('discord.js-commando');

class MentionArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'mention');
    }

    async validate(val, msg, arg) {
        const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
        if (matches) {
            try {
                const user = await msg.client.users.fetch(matches[1]);
                if (!user) return false;
                if (arg.oneOf && !arg.oneOf.includes(user.id)) return false;
                return true;
            } catch (err) {
                return false;
            }
        }

        if (!msg.guild) return false;
        const search = val.toLowerCase();
        const exactMembers = msg.guild.members.cache.filter(memberFilterExact(search));
        if (exactMembers.size === 1) {
            if (arg.oneOf && !arg.oneOf.includes(exactMembers.first().id)) return false;
            return true;
        }
        return false;
    }

    parse(val, msg) {
        const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
        if (matches) return msg.client.users.cache.get(matches[1]) || null;
        if (!msg.guild) return null;
        const search = val.toLowerCase();
        const exactMembers = msg.guild.members.cache.filter(memberFilterExact(search));
        if(exactMembers.size === 1) return exactMembers.first().user;
        return null;
    }
}


function memberFilterExact(search) {
    return mem => mem.user.username.toLowerCase() === search ||
        (mem.nickname && mem.nickname.toLowerCase() === search) ||
        `${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
}

module.exports = MentionArgumentType;