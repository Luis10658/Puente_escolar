import express from 'express';
import { getEventos, createEvento } from '../controllers/eventosController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',  getEventos);
router.post('/', verifyToken, createEvento);

export default router;