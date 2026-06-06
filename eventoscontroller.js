import pool from '../config/db.js';

export const getEventos = async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM eventos');
    res.json({ success: true, data: rows });
};

export const createEvento = async (req, res) => {
    const { id_evento, titulo, fecha, lugar, modalidad, descripcion } = req.body;
    await pool.execute(
        'INSERT INTO eventos VALUES (?, ?, ?, ?, ?, ?)',
        [id_evento, titulo, fecha, lugar, modalidad, descripcion]
    );
    res.status(201).json({ success: true, message: 'Evento creado' });
};