import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import escuelasRouter from './routes/escuelas.js';
import guiasRouter from './routes/guias.js';
import eventosRouter from './routes/eventos.js';
import authRouter from './routes/auth.js';
import escuelasFiltros from './routes/escuelas.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/escuelas', escuelasRouter);
app.use('/api/guias',    guiasRouter);
app.use('/api/eventos',  eventosRouter);
app.use('/api/auth',     authRouter);
app.use('/api/escuelasFiltros', escuelasFiltros);

app.listen(port, () => {
    console.log(`Servidor listo en http://localhost:${port}`);
});