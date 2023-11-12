import express from 'express'
import GamesControllers from '../controllers/games.js'


const route = express.Router();

route.get('/games', GamesControllers.getGames);
route.post('/games/register', GamesControllers.createGame);
route.get('/games/:gameId', GamesControllers.getGameById);
route.get('/games/notVotedBy/:judgeId', GamesControllers.getNotVotedGamesById);
route.get('/games/:gameId/judges', GamesControllers.getJudgesByGameId);
route.get('/games/order', GamesControllers.orderBy);
route.get('/games/genre/:gameGenre', GamesControllers.filterGenre);
route.get('/games/filtered/:criteria/:order', GamesControllers.criteriaFilter);
route.delete('/games/delete/:gameId', GamesControllers.deleteGameById);
route.put('/games/update/:gameId', GamesControllers.updateGameById);


export default route