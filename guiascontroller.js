import pool from '../config/db.js';

export const getGuias = async (req, res) => {
    const { categoria } = req.query;
    let sql = 'SELECT * FROM guias';
    const params = [];

    if (categoria) {
        sql += ' WHERE categoria = ?';
        params.push(categoria);
    }

    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
};

export const getGuiaById = async (req, res) => {
    const [rows] = await pool.execute(
        'SELECT * FROM guias WHERE id_guia = ?',
        [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Guía no encontrada' });
    res.json({ success: true, data: rows[0] });
};