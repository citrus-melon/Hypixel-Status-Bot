const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
/** @type {import('mongodb').Collection} */
let players;

module.exports.connect = async () => {
    await client.connect();
    players = client.db(process.env.DB_NAME).collection('players');
};

module.exports.insertOne = (...args) => players.insertOne(...args);
module.exports.updateOne = (...args) => players.updateOne(...args);
module.exports.findOneAndUpdate = (...args) => players.findOneAndUpdate(...args);
module.exports.deleteOne = (...args) => players.deleteOne(...args);
module.exports.findOneAndDelete = (...args) => players.findOneAndDelete(...args);
module.exports.countDoucments = (...args) => players.countDocuments(...args);
module.exports.findMultiple = (...args) => players.find(...args);
module.exports.findOne = (...args) => players.findOne(...args);
