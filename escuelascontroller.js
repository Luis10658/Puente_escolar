import pool from '../config/db.js';

export const getEscuelas = async (req, res) => {
    // 1. Recibimos los nuevos parámetros enviados desde la URL / query string
    const { nombre, alcaldia, estado, turno, tags } = req.query;
    
    let sql = 'SELECT * FROM escuelas';
    const params = [];
    const conditions = [];

    // 2. Filtro por Nombre de Escuela (Búsqueda parcial con LIKE)
    if (nombre) {
        conditions.push('nombre_escuela LIKE ?');
        params.push(`%${nombre}%`);
    }

    // 3. Filtro por Alcaldía / Delegación (Búsqueda parcial con LIKE)
    if (alcaldia) {
        conditions.push('alcaldia LIKE ?');
        params.push(`%${alcaldia}%`);
    }

    // 4. Filtro por Estado / Ciudad (Búsqueda parcial con LIKE)
    if (estado) {
        conditions.push('estado LIKE ?');
        params.push(`%${estado}%`);
    }

    // 5. Filtro por Turno (Búsqueda exacta, o parcial si se desea)
    if (turno) {
        conditions.push('turno = ?');
        params.push(turno);
    }

    // 6. Filtro por Tags (Por si se complementa con los botones del frontend)
    if (tags) {
        conditions.push('tags LIKE ?');
        params.push(`%${tags}%`);
    }

    // 7. Si existen filtros válidos, los unimos de forma limpia usando WHERE y AND's
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const [rows] = await pool.execute(sql, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al consultar escuelas:', error);
        res.status(500).json({ success: false, message: 'Error interno en el servidor' });
    }
};

export const getEscuelaById = async (req, res) => {
    const [rows] = await pool.execute(
        'SELECT * FROM escuelas WHERE id_escuela = ?',
        [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Escuela no encontrada' });
    res.json({ success: true, data: rows[0] });
};

export const createEscuela = async (req, res) => {
    const { id_escuela, nombre_escuela, nivel_escuela, alcaldia, estado, telefono, turno, inscripciones_abiertas, tags } = req.body;
    await pool.execute(
        'INSERT INTO escuelas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id_escuela, nombre_escuela, nivel_escuela, alcaldia, estado, telefono, turno, inscripciones_abiertas, tags]
    );
    res.status(201).json({ success: true, message: 'Escuela creada' });
};

export const updateEscuela = async (req, res) => {
    const { nombre_escuela, nivel_escuela, alcaldia, estado, telefono, turno, inscripciones_abiertas, tags } = req.body;
    await pool.execute(
        'UPDATE escuelas SET nombre_escuela=?, nivel_escuela=?, alcaldia=?, estado=?, telefono=?, turno=?, inscripciones_abiertas=?, tags=? WHERE id_escuela=?',
        [nombre_escuela, nivel_escuela, alcaldia, estado, telefono, turno, inscripciones_abiertas, tags, req.params.id]
    );
    res.json({ success: true, message: 'Escuela actualizada' });
};

export const deleteEscuela = async (req, res) => {
    await pool.execute('DELETE FROM escuelas WHERE id_escuela = ?', [req.params.id]);
    res.json({ success: true, message: 'Escuela eliminada' });
};