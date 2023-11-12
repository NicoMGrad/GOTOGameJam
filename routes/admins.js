import express from 'express';
import AdminsControllers from '../controllers/admins.js';
import { adminExistsMiddleware } from '../controllers/middlewares.js';

const router = express.Router();

router.post('/admin/register', 
    adminExistsMiddleware,
    AdminsControllers.registerAdmin);
router.post('/admin/login', AdminsControllers.loginAdmin);
router.get('/admins/:id', AdminsControllers.getAdminDetails);

export default router;
