import JudgesServices from '../services/judges.js';
import { judgeExistsMiddleware } from './middlewares.js';

function registerJudge(req, res) {
    JudgesServices.judgeExists(req.body.username)
        .then(exists => {
            if (exists) {
                return res.status(409).json({ msg: 'El juez ya existe.' });
            }
            return JudgesServices.saveJudge(req.body)
                .then(judge => {
                    res.status(201).json(judge);
                });
        })
        .catch(error => {
            res.status(500).json({ msg: 'Error interno del servidor.' });
        });
}

function loginJudge(req, res) {
    JudgesServices.authenticateJudge(req.body.username, req.body.password)
        .then(judge => {
            if (judge) {
                res.status(200).json({ name: judge.name, id: judge._id });
            } else {
                res.status(401).json({ msg: 'Nombre de usuario o contraseña incorrectos.' });
            }
        })
        .catch(error => {
            res.status(500).json({ msg: 'Error interno del servidor.' });
        });
}

function getJudgeDetails(req, res) {
    JudgesServices.getJudgeById(req.params.id)
        .then(judge => {
            if (judge) {
                res.status(200).json(judge);
            } else {
                res.status(404).json({ msg: 'Juez no encontrado.' });
            }
        })
        .catch(error => {
            res.status(500).json({ msg: 'Error interno del servidor.' });
        });
}

export default {
    registerJudge,
    loginJudge,
    getJudgeDetails
};

