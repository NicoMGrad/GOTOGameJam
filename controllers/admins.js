import AdminsServices from '../services/admins.js';
import { adminExistsMiddleware } from './middlewares.js';

function registerAdmin(req, res) {
    AdminsServices.adminExists(req.body.username)
        .then(exists => {
            if (exists) {
                return res.status(409).json({ msg: "El admin ya existe." });
            }
            return AdminsServices.saveAdmin(req.body)
                .then(admin => {
                    res.status(201).json(admin);
                });
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function loginAdmin(req, res) {
    AdminsServices.authenticateAdmin(req.body.username, req.body.password)
        .then(admin => {
            if (admin) {
                res.status(200).json({ name: admin.name, id: admin._id });
            } else {
                res.status(401).json({ msg: "Nombre de usuario o contraseña incorrectos." });
            }
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor." });
        });
}

function getAdminDetails(req, res) {
    console.log('Llegué al controller');
    AdminsServices.getAdminById(req.params.id)
        .then(admin => {
            if (admin) {
                res.status(200).json(admin);
            } else {
                res.status(404).json({ msg: "Admin no encontrado." });
            }
        })
        .catch(error => {
            res.status(500).json({ msg: "Error interno del servidor (capturado en controlador)." });
        });
}

export default {
    registerAdmin,
    loginAdmin,
    getAdminDetails
};

