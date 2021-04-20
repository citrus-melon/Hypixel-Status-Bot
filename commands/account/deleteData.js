const {Command} = require('discord.js-commando');
const dataManager = require('../../dataManager');
const getJSON = require('bent')('json');

module.exports = class ClassName extends Command {
    constructor(client) {
        super(client, {
            name: 'deletedata',
            group: 'account',
            memberName: 'delete',
            description: 'PERMANANTLY delete all data associated with a Minecraft account',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'mcName',
                    prompt: 'What the username of the account you would like to wipe?',
                    type: 'string',
                }
            ]
        })
    }

    async run(message, {mcName}) {
        const validUsername = /^\w{3,16}$/i;
        if (!mcName || !validUsername.test(mcName)) {
            message.reply(`${mcName} is not a valid Minecraft username!`);
            return;
        }

        try {
            const response = await getJSON('https://api.mojang.com/users/profiles/minecraft/' + mcName);
            const mcID = response.id;

            if (!await dataManager.list().includes(mcID)) {
                message.reply('There is no data associated with that account!');
                return;
            }

            await dataManager.remove(mcID);
            message.reply(`The data associated with ${mcName} has been permanantly deleted!`)
        }
    
        catch (error) {
            if (error.name === 'StatusError' && error.statusCode === 204) {
                message.reply(`couldn't find a Minecraft player with the username ${mcName}!`)
            }
            else throw error;
        }
    }
}