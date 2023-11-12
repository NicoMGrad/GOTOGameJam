import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('gotogamejam');
const VotesCollection = db.collection('votes');

async function saveVote(vote) {
    await client.connect();
    await VotesCollection.insertOne(vote);
    return vote;
}

async function voteExists(judgeId, gameId) {
    await client.connect();
    const vote = await VotesCollection.findOne({ judge: new ObjectId(judgeId), game: new ObjectId(gameId) });
    return Boolean(vote);
}

async function getAllVotes() {
    await client.connect();
    return VotesCollection.find().toArray();
}

async function getVotesByJudgeId(judgeId) {
    await client.connect();
    return VotesCollection.find({ judge: new ObjectId(judgeId) }).toArray();
}

async function getVoteById(id) {
    await client.connect();
    return VotesCollection.findOne({ _id: new ObjectId(id) });
}

export default {
    saveVote,
    voteExists,
    getAllVotes,
    getVotesByJudgeId,
    getVoteById
};
