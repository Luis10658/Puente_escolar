import express from 'express';
import { escuelasFiltros, getEscuelaById, createEscuela, updateEscuela, deleteEscuela } from '../controllers/escuelasController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',     escuelasFiltros); 

router.get('/:id',  getEscuelaById);
router.post('/',    verifyToken, createEscuela);
router.put('/:id',  verifyToken, updateEscuela);
router.delete('/:id', verifyToken, deleteEscuela);

export default router;