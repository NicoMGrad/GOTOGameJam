import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('gotogamejam');
const JudgesCollection = db.collection('judges');

const SALT_ROUNDS = 10;

async function saveJudge(judge) {
    const hashedPassword = await bcrypt.hash(judge.password, SALT_ROUNDS);
    const newJudge = {
        _id: new ObjectId(),
        username: judge.username,
        name: judge.name,
        password: hashedPassword
    };
    await client.connect();
    await JudgesCollection.insertOne(newJudge);
    return newJudge;
}

async function judgeExists(username) {
    await client.connect();
    const judge = await JudgesCollection.findOne({ username });
    return Boolean(judge);
}

async function findJudgeByUsername(username) {
    await client.connect();
    return JudgesCollection.findOne({ username });
}

async function authenticateJudge(username, password) {
    const judge = await findJudgeByUsername(username);
    if (!judge) return null;
    const isMatch = await bcrypt.compare(password, judge.password);
    if (!isMatch) return null;
    return judge;
}

async function getJudgeById(id) {
    await client.connect();
    return JudgesCollection.findOne({ _id: new ObjectId(id) });
}

export default {
    saveJudge,
    judgeExists,
    findJudgeByUsername,
    authenticateJudge,
    getJudgeById
};