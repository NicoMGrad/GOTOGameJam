import JudgesServices from '../services/judges.js';
import VotesServices from '../services/votes.js';
import AdminsServices from '../services/admins.js';

function judgeExistsMiddleware(req, res, next) {
    JudgesServices.findJudgeByUsername(req.body.username)
        .then(judge => {
            if (judge) {
                return res.status(409).json({ msg: "El juez ya existe." });
            }
            next();
        })
        .catch(err => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function adminExistsMiddleware(req, res, next) {
    AdminsServices.findAdminByUsername(req.body.username)
        .then(admin => {
            if (admin) {
                return res.status(409).json({ msg: "El nombre de usuario de admin ya existe." });
            }
            next();
        })
        .catch(err => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function voteExistsMiddleware(req, res, next) {
    VotesServices.voteExists(req.body.judge, req.body.game)
        .then(exists => {
            if (exists) {
                return res.status(409).json({ msg: "El juez ya votó este juego." });
            }
            next();
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

export {
    judgeExistsMiddleware,
    voteExistsMiddleware,
    adminExistsMiddleware
};

export default {
    judgeExistsMiddleware,
    voteExistsMiddleware,
    adminExistsMiddleware
};
