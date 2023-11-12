import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('gotogamejam');
const GamesCollection = db.collection('games');
const VotesCollection = db.collection('votes');
const JudgesCollection = db.collection('judges');

async function getNotVotedGamesById(judgeId) {
    await client.connect();

    const votedGames = await VotesCollection.find({judge: new ObjectId(judgeId)}).toArray();
    const votedGamesIds = votedGames.map(vote => vote.game);

    const notVotedGames = await GamesCollection.find({ _id: { $nin: votedGamesIds } }).toArray();    
    return notVotedGames;
}

function filterQueryToMongo(filter){
    const filterMongo = {};
    for(const filled in filter){
        if(isNaN(filter[filled])){
            filterMongo[filled] = filter[filled]
        } else {
            const [field, op] = filled.split('_');
            if(!op){
                filterMongo[filled] = parseInt(filter[filled])
            } else {
                if(op === 'min'){
                    filterMongo[field] = {
                        $gte: parseInt(filter[filled])
                    } 
                } else if (op === 'max'){
                    filterMongo[field] = {
                        $lte: parseInt(filter[filled])
                    } 
                }
            }
        }
    }
    return filterMongo
}

async function orderBy(){
    const filterMongo = filterQueryToMongo(filter);
    return GamesCollection.find(filterMongo).toArray();
}

async function filterGenre(gameGenre){
    return GamesCollection.find({ genre: gameGenre}).sort({ name: 1}).toArray();
}

async function criteriaFilter(criteria, order = 1){
    let sortCriteria = {};

    switch(criteria){
        case 'name':
            sortCriteria = { name: parseInt(order) };
            break
        case 'score':
            sortCriteria = { finalScore: parseInt(order) };
            break
        case 'edition':
            sortCriteria = { edition: parseInt(order) }
        
    }

    console.log(sortCriteria)

    return GamesCollection.find().sort(sortCriteria).toArray();
}


async function getGames(filter={}){
    await client.connect();
    const filterMongo = filterQueryToMongo(filter);
    return GamesCollection.find(filterMongo).toArray();
}

async function getGameById(id){
    await client.connect()
    return GamesCollection.findOne({_id: new ObjectId(id)})
    .catch((err) => {
        console.log(err);
    })
    .finally(() => {
     client.close();
    });
}

async function deleteGameById(id){
    await client.connect();
    try {
        const result = await GamesCollection.deleteOne({_id: new ObjectId(id)});
        return result;
    } catch(err) {
        console.error("Error tratando de borrar el juego:", err);
        throw err;
    }
}

async function createGame(game){
    await client.connect()
    const newgame = {
        _id: new ObjectId(),
        ...game}
    
    await GamesCollection.insertOne(newgame)
    return newgame
}

async function updateGameById(id, gameData){
    await client.connect()
    const updateGame = await GamesCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: gameData },
        { returnDocument: 'after' }
    );

    return updateGame.value
}

async function getJudgesByGameId(gameId) {
    await client.connect();

    try {
        const votes = await VotesCollection.find({ game: new ObjectId(gameId) }).sort({ finalScore: 1}).toArray();

        const judgesInfo = await Promise.all(
            votes.map(async vote => {
                const judge = await JudgesCollection.findOne({ _id: vote.judge });
                return {
                    judgeName: judge.name,
                    judgeUsername: judge.username,
                    scores: vote.scores,
                    finalScore: vote.finalScore,
                };
            })
        );

        return judgesInfo;
    } catch (error) {
        console.error('Error en getJudgesByGameId:', error);
        throw error;
    }
}


export {
    getGames,
    getGameById,
    createGame,
    getNotVotedGamesById,
    orderBy,
    filterGenre,
    criteriaFilter,
    deleteGameById,
    updateGameById,
    getJudgesByGameId
}

export default {
    getGames,
    getGameById,
    createGame,
    getNotVotedGamesById,
    orderBy,
    filterGenre,
    criteriaFilter,
    deleteGameById,
    updateGameById,
    getJudgesByGameId
}