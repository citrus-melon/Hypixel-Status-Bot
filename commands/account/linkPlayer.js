const { Command } = require('discord.js-commando');
const getJSON = require('bent')('json');
const dataManager = require('../../dataManager');

module.exports = class linkPlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'link',
            group: 'account',
            memberName: 'link',
            description: 'Link a minecraft account to a discord account',
            args: [
                {
                    key: 'mcName',
                    prompt: 'What is your Minecraft username?',
                    type: 'string',
                },
                {
                    key: 'member',
                    prompt: 'Which discord account would you like to link this account to?',
                    type: 'user',
                    default: message => message.author
                }
            ]
        });
    }

    /** @param {import('discord.js-commando').CommandoMessage} message */
    async run(message, { member, mcName }) {
        const discordID = member.id;

        const validUsername = /^\w{3,16}$/i;
        if (!mcName || !validUsername.test(mcName)) {
            message.reply(`${mcName} is not a valid Minecraft username!`);
            return;
        }

        if (member !== message.author && !message.member.hasPermission('MANAGE_NICKNAMES')) {
            message.reply('You need the `Manage Nicknames` permission to manage other accounts!');
            return;
        }
    
        try {
            const response = await getJSON('https://api.mojang.com/users/profiles/minecraft/' + mcName);
            const mcID = response.id;

            let player = await dataManager.getByMinecraft(mcID);

            if (!player) {
                player = new dataManager.Player(mcID, discordID);
            }

            else if (!player.discordID) player.discordID = discordID;

            else {
                if (player.discordID !== discordID) message.reply('That account has already been linked by someone else!');
                else message.reply('Those accounts are already linked!');
                return;
            }

            await dataManager.set(mcID, player);
            message.reply(`sucessfully linked ${member.tag} to ${mcName}!`)
        }
    
        catch (error) {
            if (error.name === 'StatusError' && error.statusCode === 204) {
                message.reply(`couldn't find a Minecraft player with the username ${mcName}!`)
            }
            else throw error;
        }
    }
};