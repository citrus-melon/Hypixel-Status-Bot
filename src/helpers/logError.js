/**
 * @param {Error} error
 * @param {string} context
 * @param {import('discord.js').Client} client
 */
module.exports = async (error, context, client) => {
    try {
        console.error('Context: ' + context);
        console.error(error);
        const owner = await client.users.fetch(process.env.OWNER_ID);
        if (!owner) return;
        owner.send('Unexpected error: ' + context + '\n```' + error.stack + '```').catch(handleMetaError);
    } catch (metaError) { // We don't want an infinite promise rejection loop
        console.error('An error occurred while logging an error:');
        console.error(metaError);
    }
}