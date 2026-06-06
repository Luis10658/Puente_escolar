import express from 'express';
import { getGuias, getGuiaById } from '../controllers/guiasController.js';

const router = express.Router();

router.get('/',    getGuias);
router.get('/:id', getGuiaById);

export default router;