import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );

    if (rows.length === 0)
        return res.status(401).json({ message: 'Credenciales incorrectas' });

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida)
        return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
        { id: usuario.id_usuario, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({ success: true, token });
};