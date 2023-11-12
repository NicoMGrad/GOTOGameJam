import express from 'express';
import JudgesControllers from '../controllers/judges.js';
import { judgeExistsMiddleware } from '../controllers/middlewares.js';

const router = express.Router();

router.post('/judge/register', 
    judgeExistsMiddleware, 
    JudgesControllers.registerJudge);
router.post('/login', JudgesControllers.loginJudge);
router.get('/judges/:id', JudgesControllers.getJudgeDetails);

export default router;
