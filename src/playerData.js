const { MongoClient } = require('mongodb');
const Player = require('./player');

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
/** @type {import('mongodb').Collection<Player>} */
let players;

module.exports.connect = async () => {
    await client.connect();
    players = client.db(process.env.DB_NAME).collection('players');
};

/**
 * @param {Player} player 
 * @param {import('mongodb').CollectionInsertOneOptions} options
 */
module.exports.insertOne = (player) => players.insertOne(player, options);
/**
* @param {import('mongodb').FilterQuery<Player>} query 
* @param {Partial<Player> | import('mongodb').UpdateQuery<Player>} update 
* @param {import('mongodb').UpdateOneOptions} options 
*/
module.exports.updateOne = (query, update, options) => players.updateOne(query, update, options)
/**
* @param {import('mongodb').FilterQuery<Player>} query 
* @param {Player | import('mongodb').UpdateQuery<Player>} update 
* @param {import('mongodb').FindOneAndUpdateOption<Player>} options 
*/
module.exports.findOneAndUpdate = (query, update, options) => players.findOneAndUpdate(query, update, options);
/**
 * @param {import('mongodb').FilterQuery<Player>} query 
 * @param {import('mongodb').CommonOptions} options 
 */
module.exports.deleteOne = (query, options) => players.deleteOne(query, options);
/**
 * @param {import('mongodb').FilterQuery<Player>} query 
 * @param {import('mongodb').FindOneAndDeleteOption<Player>} options 
 */
module.exports.findOneAndDelete = (query, options) => players.findOneAndDelete(query, options);
/**
 * @param {import('mongodb').FilterQuery<Player>} query 
 */
module.exports.countDoucments = (query) => players.countDocuments(query);
/**
 * @param {import('mongodb').FilterQuery<Player>} query 
 * @param {import('mongodb').FindOneOptions<Player>} options 
 */
module.exports.findMultiple = (query, options) => players.find(query, options);
/**
 * @param {import('mongodb').FilterQuery<Player>} query 
 * @param {import('mongodb').FindOneOptions<Player>} options 
 */
module.exports.findOne = (query, options) => players.findOne(query, options);