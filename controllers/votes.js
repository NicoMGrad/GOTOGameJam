import { ObjectId } from 'mongodb';
import VotesServices from '../services/votes.js';

function registerVote(req, res) {
    const vote = {
        judge: new ObjectId(req.body.judge),
        game: new ObjectId(req.body.game),
        scores: req.body.scores,
        finalScore: (
            Number(req.body.scores.gameplay) + 
            Number(req.body.scores.art) + 
            Number(req.body.scores.sound) + 
            Number(req.body.scores.afinity)
        ) / 4
    };

    VotesServices.saveVote(vote)
        .then(savedVote => {
            res.status(201).json(savedVote);
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function getAllVotes(req, res) {
    VotesServices.getAllVotes()
        .then(votes => {
            res.status(200).json(votes);
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function getVotesByJudge(req, res) {
    const judgeId = req.params.judgeId;

    VotesServices.getVotesByJudgeId(judgeId)
        .then(votes => {
            if (!votes) {
                return res.status(404).json({ msg: "No se encontraron votos para este juez." });
            }
            res.status(200).json(votes);
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function getVoteById(req, res) {
    const voteId = req.params.id;

    VotesServices.getVoteById(voteId)
        .then(vote => {
            if (!vote) {
                return res.status(404).json({ msg: "Voto no encontrado." });
            }
            res.status(200).json(vote);
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}


export default {
    registerVote,
    getAllVotes,
    getVoteById,
    getVotesByJudge
};
