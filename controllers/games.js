import GamesServices from '../services/games.js'

function getGames(req,res){
    GamesServices.getGames(req.query)
    .then(function(GamesList){
        res.status(200).json(GamesList)
    })
};

function filterGenre(req,res){
  const { gameGenre } = req.params;
  console.log(gameGenre);
  GamesServices.filterGenre(gameGenre)
  .then(function(GamesList){
      res.status(200).json(GamesList)
  });
};

function criteriaFilter(req,res){
  GamesServices.criteriaFilter(req.params.criteria,req.params.order)
  .then(function(GamesList){
      res.status(200).json(GamesList)
  });
};

function getGameById(req,res){
    const { idGame } = req.params;
    GamesServices.getGameById(idGame)
    .then(function (game){
      return res.status(200).json(game)
    })
    .catch(function(err){
      if(err?.code){
        res.status(err.code).json({ msg: err.msg});
      } else {
        res.status(500).json({ msg: 'No se pudo encontrar el juego solicitado'});
      }
    })
};

async function orderBy(req, res){
  GamesServices.getGames(req.query)
    .then(function(GamesList){
        res.status(200).json(GamesList)
    })
}

async function createGame(req,res){
  return GamesServices.createGame(req.body)
    .then(function(game){
      res.status(201).json(game)
    })
    .catch(function(err){
      res.status(500).json({msg:err.msg})
    })
}

async function updateGameById(req,res){
  const gameId = req.params.gameId;
    const gameData = req.body; 

    try {
        const updatedGame = await GamesServices.updateGameById(gameId, gameData);
        res.json(updatedGame);
    } catch (error) {
        console.error('Error actualizando el juego:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function getNotVotedGamesById(req, res){
  const { judgeId } = req.params;
  return GamesServices.getNotVotedGamesById(judgeId)
    .then(function(games){
      res.status(201).json(games)
    })
    .catch(function(err){
      res.status(500).json({msg:err.msg})
    })
}

async function deleteGameById(req, res){
  const { gameId } = req.params;
  try {
    const result = await GamesServices.deleteGameById(gameId);
    if(result.deletedCount === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json({ message: 'Juego borrado exitosamente' });
  } catch(err) {
    res.status(500).json({ message: 'Error intentando borrar el juego', error: err.message });
  }
}

async function getJudgesByGameId(req, res) {
  const gameId = req.params.gameId;

  try {
      const judges = await GamesServices.getJudgesByGameId(gameId);
      res.status(200).json(judges);
  } catch (error) {
      console.error('Error en getJudgesByGameId:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
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